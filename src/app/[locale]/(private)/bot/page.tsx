import { getCredentialsStatus } from "@/actions/credentials/check";
import { CustomButton } from "@/components/CustomButton";
import { ManageCredentialsSheet } from "@/components/private/credentials/ManageCredentialsSheet";
import { CredentialCard } from "@/components/private/credentials/CredentialCard";
import { getTranslations } from "next-intl/server";

export default async function Bot() {
    const t = await getTranslations("bot");
    const credentialsStatus = await getCredentialsStatus();

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-end px-6 pt-4">
                <ManageCredentialsSheet>
                    <CustomButton isBlue={false}>
                        {t("addCredentials")}
                    </CustomButton>
                </ManageCredentialsSheet>
            </div>
            {Object.keys(credentialsStatus).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full md:w-1/4 mx-auto gap-2 px-6 md:px-0">
                    <h1 className="text-lg font-bold">
                        {t("noCredentialsTitle")}
                    </h1>
                    <p className="text-xs text-tertiary text-center">
                        {t("noCredentialsDescription")}
                    </p>
                </div>
            ) : (
            <div className="flex flex-col gap-8 p-6">
                {Object.keys(credentialsStatus).map((key) => (
                    <CredentialCard
                        key={key}
                        exchangeKey={key}
                        credentials={credentialsStatus[key]}
                    />
                ))}
            </div>
                )}
        </div>
    );
}
