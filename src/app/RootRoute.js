import App from 'app/components/App';
import Benchmark from 'app/components/pages/Benchmark';
import WalletIndex from 'app/components/pages/WalletIndex';
import resolveRoute from './ResolveRoute';

// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default {
    path: '/',
    component: App,
    getChildRoutes(nextState, cb) {
        const route = resolveRoute(nextState.location.pathname);
        if (route.page === 'About') {
            cb(null, [require('app/components/pages/About')]);
        } else if (route.page === 'Welcome') {
            cb(null, [require('app/components/pages/Welcome')]);
        } else if (route.page === 'Faq') {
            cb(null, [require('app/components/pages/Faq')]);
        } else if (route.page === 'Login') {
            cb(null, [require('app/components/pages/Login')]);
        } else if (route.page === 'Privacy') {
            cb(null, [require('app/components/pages/Privacy')]);
        } else if (route.page === 'Support') {
            cb(null, [require('app/components/pages/Support')]);
        } else if (
            route.page === 'XSSTest' &&
            process.env.NODE_ENV === 'development'
        ) {
            cb(null, [require('app/components/pages/XSS')]);
        } else if (route.page === 'Benchmark') {
            cb(null, [require('app/components/pages/Benchmark')]);
        } else if (route.page === 'Tos') {
            cb(null, [require('app/components/pages/Tos')]);
        } else if (route.page === 'ChangePassword') {
            cb(null, [require('app/components/pages/ChangePasswordPage')]);
        } else if (route.page === 'CreateAccount') {
            cb(null, [require('app/components/pages/CreateAccount')]);
        } else if (route.page === 'Approval') {
            cb(null, [require('app/components/pages/Approval')]);
        } else if (route.page === 'RecoverAccountStep1') {
            cb(null, [require('app/components/pages/RecoverAccountStep1')]);
        } else if (route.page === 'RecoverAccountStep2') {
            cb(null, [require('app/components/pages/RecoverAccountStep2')]);
        } else if (route.page === 'Witnesses') {
            cb(null, [require('app/components/pages/Witnesses')]);
        } else if (route.page === 'SteemProposalSystem') {
            cb(null, [require('app/components/pages/SteemProposalSystem')]);
        } else if (route.page === 'UserProfile') {
            cb(null, [require('app/components/pages/UserProfile')]);
        } else if (route.page === 'Market') {
            require.ensure([], require => {
                cb(null, [require('app/components/pages/Market')]);
            });
        } else if (route.page === 'WalletIndex') {
            cb(null, [WalletIndex]);
        } else {
            cb(process.env.BROWSER ? null : Error(404), [
                require('app/components/pages/NotFound'),
            ]);
        }
    },
    indexRoute: {
        component: WalletIndex.component,
    },
};
