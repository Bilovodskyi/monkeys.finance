export interface GeoData {
    country_code: string;
    country_name: string;
    city?: string;
    ip: string;
}

/**
 * Detect user's country from IP address
 * Using ipapi.co (free tier: 1000 requests/day)
 */
export async function detectCountryFromIP(ip: string): Promise<GeoData> {
    // Skip API call for local/invalid IPs
    if (
        !ip ||
        ip === "0.0.0.0" ||
        ip.startsWith("127.") ||
        ip.startsWith("192.168.") ||
        ip.startsWith("10.")
    ) {
        console.log("Local/invalid IP detected, using US as default");
        return {
            country_code: "US",
            country_name: "United States",
            ip,
        };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: {
                "User-Agent": "AlgoSquid/1.0",
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`IP API error: ${response.status}`);
        }

        const data = await response.json();

        // Check if we hit rate limit
        if (data.error) {
            console.error("IP API error:", data);
            throw new Error(data.reason || "IP detection failed");
        }

        return {
            country_code: data.country_code || "US",
            country_name: data.country_name || "United States",
            city: data.city,
            ip: data.ip || ip,
        };
    } catch (error) {
        console.error("Error detecting country:", error);
        // Fallback to US if detection fails
        return {
            country_code: "US",
            country_name: "United States",
            ip,
        };
    }
}

/**
 * Get user's IP from request headers
 */
export function getClientIP(request: Request): string {
    // Check common headers (works with Vercel, Cloudflare, etc.)
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP.trim();
    }

    // Fallback
    return "0.0.0.0";
}
