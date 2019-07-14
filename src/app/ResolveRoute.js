import GDPRUserList from './utils/GDPRUserList';

export const routeRegex = {
    UserProfile1: /^\/(@[\w\.\d-]+)\/?$/,
    UserProfile2: /^\/(@[\w\.\d-]+)\/(transfers|curation-rewards|author-rewards|permissions|password|settings)\/?$/,
};

export default function resolveRoute(path) {
    let match;
    if (path === '/') {
        return { page: 'WalletIndex' };
    }
    if (path === '/about.html') {
        return { page: 'About' };
    }
    if (path === '/welcome') {
        return { page: 'Welcome' };
    }
    if (path === '/faq.html') {
        return { page: 'Faq' };
    }
    if (path === '/login.html') {
        return { page: 'Login' };
    }
    if (path === '/privacy.html') {
        return { page: 'Privacy' };
    }
    if (path === '/support.html') {
        return { page: 'Support' };
    }
    if (path === '/xss/test' && process.env.NODE_ENV === 'development') {
        return { page: 'XSSTest' };
    }
    if (path === '/benchmark' && process.env.OFFLINE_SSR_TEST) {
        return { page: 'Benchmark' };
    }
    if (path === '/tos.html') {
        return { page: 'Tos' };
    }
    if (path === '/change_password') {
        return { page: 'ChangePassword' };
    }
    if (path === '/create_account') {
        return { page: 'CreateAccount' };
    }
    if (path === '/approval') {
        return { page: 'Approval' };
    }
    if (path === '/recover_account_step_1') {
        return { page: 'RecoverAccountStep1' };
    }
    if (path === '/recover_account_step_2') {
        return { page: 'RecoverAccountStep2' };
    }
    if (path === '/market') {
        return { page: 'Market' };
    }
    if (path === '/~witnesses') {
        return { page: 'Witnesses' };
    }
    if (path === '/steem_proposal_system') {
        return { page: 'SteemProposalSystem' };
    }
    match =
        path.match(routeRegex.UserProfile1) ||
        path.match(routeRegex.UserProfile2);
    if (match) {
        if (GDPRUserList.includes(match[1].substring(1))) {
            return { page: 'NotFound' };
        }
        return { page: 'UserProfile', params: match.slice(1) };
    }
    return { page: 'NotFound' };
}
