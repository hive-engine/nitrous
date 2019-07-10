jest.mock('./utils/GDPRUserList');
import resolveRoute, { routeRegex } from './ResolveRoute';

describe('routeRegex', () => {
    it('should produce the desired regex patterns', () => {
        const test_cases = [
            ['UserProfile1', /^\/(@[\w\.\d-]+)\/?$/],
            [
                'UserProfile2',
                /^\/(@[\w\.\d-]+)\/(transfers|curation-rewards|author-rewards|permissions|password|settings)\/?$/,
            ],
        ];

        test_cases.forEach(r => {
            expect(routeRegex[r[0]]).toEqual(r[1]);
        });
    });
});

describe('resolveRoute', () => {
    const test_cases = [
        ['/', { page: 'WalletIndex' }],
        ['/about.html', { page: 'About' }],
        ['/faq.html', { page: 'Faq' }],
        ['/login.html', { page: 'Login' }],
        ['/privacy.html', { page: 'Privacy' }],
        ['/support.html', { page: 'Support' }],
        ['/tos.html', { page: 'Tos' }],
        ['/change_password', { page: 'ChangePassword' }],
        ['/create_account', { page: 'CreateAccount' }],
        ['/approval', { page: 'Approval' }],
        ['/recover_account_step_1', { page: 'RecoverAccountStep1' }],
        ['/recover_account_step_2', { page: 'RecoverAccountStep2' }],
        ['/market', { page: 'Market' }],
        ['/~witnesses', { page: 'Witnesses' }],
        ['/steem_proposal_system', { page: 'SteemProposalSystem' }],
        ['/@gdpr/nice345', { page: 'NotFound' }],
        ['/taggy/@gdpr/nice345', { page: 'NotFound' }],
    ];
    test_cases.forEach(r => {
        it(`should resolve the route for the ${r[1].page} page`, () => {
            expect(resolveRoute(r[0])).toEqual(r[1]);
        });
    });

    it('should resolve xss test route in development environment', () => {
        expect(resolveRoute('/xss/test')).toEqual({ page: 'NotFound' });
        process.env.NODE_ENV = 'development';
        expect(resolveRoute('/xss/test')).toEqual({ page: 'XSSTest' });
        delete process.env.NODE_ENV;
    });
    it('should resolve benchmark route in development environment', () => {
        expect(resolveRoute('/benchmark')).toEqual({ page: 'NotFound' });
        process.env.OFFLINE_SSR_TEST = true;
        expect(resolveRoute('/benchmark')).toEqual({ page: 'Benchmark' });
        delete process.env.OFFLINE_SSR_TEST;
    });
    it('should resolve an unknown route to NotFound', () => {
        expect(resolveRoute('/randomness')).toEqual({ page: 'NotFound' });
    });
});
