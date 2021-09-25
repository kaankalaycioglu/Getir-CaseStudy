const checkPayload = payload => {
    const fields = ['startDate', 'endDate', 'minCount', 'maxCount'];

    for (let field of fields) {
        if (!payload.hasOwnProperty(field)) {
            return false;
        }
    }

    return true;
};

export default checkPayload;