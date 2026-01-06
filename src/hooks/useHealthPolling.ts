"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchInstancesHealth, type InstanceHealthMap } from "@/actions/instances/fetchHealth";

const POLL_INTERVAL_MS = 2000; // 3 seconds
const MAX_POLL_DURATION_MS = 20000; // 20 seconds max polling

export type UseHealthPollingReturn = {
    healthMap: InstanceHealthMap;
    isPolling: boolean;
    refetchHealth: () => void;
};

/**
 * Custom hook to fetch and poll instance health status.
 * Automatically polls every 5 seconds when any instance has CHECKING status.
 * Stops polling after 60 seconds max duration.
 * 
 * @param instanceIds - Array of instance IDs to fetch health for
 */
export function useHealthPolling(instanceIds: string[]): UseHealthPollingReturn {
    const [healthMap, setHealthMap] = useState<InstanceHealthMap>({});
    const [isPolling, setIsPolling] = useState(false);
    
    // Track when polling started for timeout
    const pollStartTime = useRef<number | null>(null);
    // Track instance IDs to detect changes
    const instanceIdsRef = useRef<string[]>([]);

    // Fetch health data
    const fetchHealth = useCallback(async () => {
        if (instanceIds.length === 0) {
            setHealthMap({});
            return;
        }
        
        try {
            const healthData = await fetchInstancesHealth(instanceIds);
            setHealthMap(healthData);
        } catch (err) {
            console.error("Error fetching health data:", err);
        }
    }, [instanceIds]);

    // Manual refetch trigger
    const refetchHealth = useCallback(() => {
        fetchHealth();
    }, [fetchHealth]);

    // Initial fetch when instanceIds change
    useEffect(() => {
        // Check if instanceIds actually changed
        const idsChanged = 
            instanceIds.length !== instanceIdsRef.current.length ||
            instanceIds.some((id, i) => id !== instanceIdsRef.current[i]);
        
        if (idsChanged) {
            instanceIdsRef.current = instanceIds;
            fetchHealth();
        }
    }, [instanceIds, fetchHealth]);

    // Polling effect: refetch every 2 seconds while any instance has CHECKING status
    // Stops after 20 seconds max polling duration
    useEffect(() => {
        const hasCheckingStatus = Object.values(healthMap).some(
            (health) => health?.status === "CHECKING"
        );

        if (!hasCheckingStatus) {
            // Reset poll state when not polling
            pollStartTime.current = null;
            setIsPolling(false);
            return;
        }

        // Start polling timer if not already started
        if (pollStartTime.current === null) {
            pollStartTime.current = Date.now();
            setIsPolling(true);
        }

        // Check if we've exceeded max poll duration
        const elapsedTime = Date.now() - pollStartTime.current;
        if (elapsedTime >= MAX_POLL_DURATION_MS) {
            console.log("Health check polling timeout reached (60s). Stopping poll.");
            pollStartTime.current = null;
            setIsPolling(false);
            return;
        }

        const pollInterval = setInterval(() => {
            const currentElapsed = Date.now() - (pollStartTime.current || Date.now());
            if (currentElapsed >= MAX_POLL_DURATION_MS) {
                clearInterval(pollInterval);
                pollStartTime.current = null;
                setIsPolling(false);
                console.log("Health check polling timeout reached. Stopping.");
                return;
            }
            fetchHealth();
        }, POLL_INTERVAL_MS);

        return () => clearInterval(pollInterval);
    }, [healthMap, fetchHealth]);

    return {
        healthMap,
        isPolling,
        refetchHealth,
    };
}
