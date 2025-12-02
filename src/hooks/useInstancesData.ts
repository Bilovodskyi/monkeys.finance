"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser, type UserData } from "@/actions/user/fetch";
import { fetchUserInstances, type InstanceData } from "@/actions/instances/fetch";
import { getCredentialsStatus, type CredentialsStatus } from "@/actions/credentials/check";
import { computeDaysLeft, hasEntitlement } from "@/lib/has-entitelment-client";

// Default retry delays - moved outside to prevent infinite re-renders
const DEFAULT_RETRY_DELAYS = [0, 200, 500, 1000, 1500, 2000]; // ~5.2s total

export type UseInstancesDataReturn = {
    user: UserData | null;
    instances: InstanceData[];
    credentialsStatus: CredentialsStatus | null;
    hasActiveSubscription: boolean;
    isLoading: boolean;
    error: boolean;
    daysLeft: number;
};

/**
 * Custom hook to fetch user data with retry logic for newly created users.
 * Handles Clerk webhook timing by retrying with exponential backoff.
 * 
 * @param maxRetries - Maximum number of retry attempts (default: 6)
 * @param delays - Array of delay milliseconds between retries
 */
export function useInstancesData(
    maxRetries = 6,
    delays = DEFAULT_RETRY_DELAYS
): UseInstancesDataReturn {
    const [user, setUser] = useState<UserData | null>(null);
    const [instances, setInstances] = useState<InstanceData[]>([]);
    const [credentialsStatus, setCredentialsStatus] = useState<CredentialsStatus | null>(null);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let attemptCount = 0;

        async function loadUserWithRetry() {
            while (attemptCount < maxRetries && isMounted) {
                try {
                    const foundUser = await fetchCurrentUser();

                    if (foundUser && isMounted) {
                        setUser(foundUser);
                        
                        // Fetch instances and credentials in parallel
                        const [instancesData, credData] = await Promise.all([
                            fetchUserInstances(foundUser.id),
                            getCredentialsStatus(),
                        ]);

                        setInstances(instancesData);
                        setCredentialsStatus(credData);
                        
                        // Check subscription
                        const hasSubscription = hasEntitlement({
                            billingStatus: foundUser.billingStatus,
                            subscriptionEndsAt: foundUser.subscriptionEndsAt || new Date(0),
                            cancelAtPeriodEnd: foundUser.cancelAtPeriodEnd ?? false,
                        });
                        setHasActiveSubscription(hasSubscription);
                        setIsLoading(false);
                        return;
                    }

                    // User not found - wait before retry
                    if (attemptCount < maxRetries - 1) {
                        const delay = delays[attemptCount] || delays[delays.length - 1];
                        await new Promise((resolve) => setTimeout(resolve, delay));
                        attemptCount++;
                    } else {
                        break;
                    }
                } catch (err) {
                    console.error("Error loading data:", err);
                    break;
                }
            }

            // All retries exhausted
            if (isMounted) {
                setIsLoading(false);
                setError(true);
            }
        }

        loadUserWithRetry();

        return () => {
            isMounted = false;
        };
    }, [maxRetries, delays]);

    return {
        user,
        daysLeft: computeDaysLeft(user?.subscriptionEndsAt ?? null),
        instances,
        credentialsStatus,
        hasActiveSubscription,
        isLoading,
        error,
    };
}
