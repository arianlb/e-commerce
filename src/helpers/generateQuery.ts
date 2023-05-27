export const generateQuery = (searchCriterias: any) => {
    const {
        name,
        price,
        amountStock,
        category,
        tags,
        description,
        additionalInfo,
        starts,
        sku
    } = searchCriterias;
    
    const query = { name, price, amountStock, category, tags, description, additionalInfo, starts, sku };
    
    const queryKeys = Object.keys(query);
    const queryValues = Object.values(query);
    const queryResult: any = {};
    queryKeys.forEach((key, index) => {
        if (queryValues[index] !== undefined) {
            queryResult[key] = queryValues[index];
        }
    });
    return queryResult;
}