/**
 * This function makes the hashmap for items and accounts field
 */
export const setAccountItemsHashMaps = (accounts, xeroHashMaps) => {
    const accountsHashmap = { ids: {}, all: [] };
    const itemsHashmap = { ids: {}, all: [] };

    if (accounts) {
        /**
         * Making hashmap for all Accounts
         */
        accounts.forEach((account) => {
            accountsHashmap.ids[account._id] = {
                name: account.accountName,
                items: account.itemIds,
                type: account.accountType,
            };
            accountsHashmap.all.push({
                id: account._id,
                name: account.accountName,
                type: account.accountType,
            });
        });

        /**
         * Making hashmap for all Items
         */
        for (const key in accountsHashmap.ids) {
            const account = accountsHashmap.ids[key];
            account.items = account.items.map((item) => {
                if (!itemsHashmap.ids[item._id]) {
                    const accountNamesAndIds = item.accountIds.map((accountId) => ({
                        name: accountsHashmap.ids[accountId]?.name,
                        id: accountId,
                        type: accountsHashmap.ids[accountId]?.type,
                    }));
                    itemsHashmap.ids[item._id] = {
                        name: item.itemName,
                        accounts: accountNamesAndIds,
                    };
                    itemsHashmap.all.push({ name: item.itemName, id: item._id });
                }
                return { name: item.itemName, id: item._id };
            });
        }

        xeroHashMaps = {
            accountsHashmap: accountsHashmap,
            itemsHashmap: itemsHashmap
        }
    } else {
        xeroHashMaps = {
            accountsHashmap: { ids: {}, all: [] },
            itemsHashmap: { ids: {}, all: [] },
        }
    }
    return xeroHashMaps;
}


