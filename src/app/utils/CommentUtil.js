export function clean_permlink(link) {
    if (link) return link.replace(/[^\d\w-]+/g, '-');
    else return link;
}
