"use client";

import { CustomButton } from "@/components/CustomButton";
import { useState } from "react";

export default function Instances() {
    const [instances, setInstances] = useState([]);

    if (instances.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-1/4 mx-auto gap-2">
                <h1 className="text-lg font-bold">Add your first instance</h1>
                <p className="text-center text-sm text-tertiary">Instance is a function that will run on the cloud 24/7 constantly checking for new signals. Once signal is detected, the instance will open a position on the exchange. After instance automatically closes the position once opposite signal is detected.</p>
                <div className="flex gap-2 mt-6">
                    <CustomButton isBlue={false}>Add instance</CustomButton>
                </div>
                <p className="text-xs text-tertiary mt-6">Visit documentation page for more information</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Instances</h1>
        </div>
    )
}