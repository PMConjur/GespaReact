export const getPhoneNumberFromContext = ({
    isManagment,
    selectedAnswer,
    isDataAllPhones,
    selectedPhoneForFollowUps
}) => {
    const formatPhoneNumber = (phone) => {
        if (!phone) return "";
        const phoneStr = phone.toString();
        const last4 = phoneStr.slice(-4);
        const masked = phoneStr.slice(0, -4).replace(/./g, "X");
        return masked + last4;
    };

    if (selectedPhoneForFollowUps) {
        return {
            raw: selectedPhoneForFollowUps,
            formatted: formatPhoneNumber(selectedPhoneForFollowUps),
            source: "selectedPhoneForFollowUps"
        };
    }

    if (isManagment?.gestion?.numeroTelefonico) {
        return {
            raw: isManagment.gestion.numeroTelefonico.toString(),
            formatted: formatPhoneNumber(isManagment.gestion.numeroTelefonico),
            source: "management"
        };
    }

    if (selectedAnswer?.dataPhone?.númeroTelefónico) {
        return {
            raw: selectedAnswer.dataPhone.númeroTelefónico.toString(),
            formatted: formatPhoneNumber(selectedAnswer.dataPhone.númeroTelefónico),
            source: "selectedAnswer"
        };
    }

    if (Array.isArray(isDataAllPhones) && isDataAllPhones.length > 0) {
        const phoneFromDataAllPhones = isDataAllPhones[0]?.númeroTelefónico || "";
        return {
            raw: phoneFromDataAllPhones.toString(),
            formatted: formatPhoneNumber(phoneFromDataAllPhones),
            source: "isDataAllPhones"
        };
    }

    return { raw: "", formatted: "", source: "none" };
};
