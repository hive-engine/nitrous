export const loadUserTemplates = username => {
    const lsEntryName = `hivePostTemplates-${username}`;
    let userTemplates = window.localStorage.getItem(lsEntryName);
    if (userTemplates) {
        userTemplates = JSON.parse(userTemplates);
    } else {
        userTemplates = [];
    }

    return userTemplates;
};

export const saveUserTemplates = (username, templates) => {
    const lsEntryName = `hivePostTemplates-${username}`;
    window.localStorage.setItem(lsEntryName, JSON.stringify(templates));
};
