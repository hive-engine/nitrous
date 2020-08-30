import { makeCanonicalLink } from './CanonicalLinker';
const DEFAULT_URL = 'https://hive.blog';

describe('makeCanonicalLink', () => {
    const post_data = {
        author: 'test',
        permlink: 'test-post',
        category: 'testing',
        link: '/testing/@test/test-post',
    };
    const test_cases = [
        [
            'handles posts from hive.blog',
            { ...post_data, json_metadata: {} },
            'https://hive.blog/testing/@test/test-post',
        ],
        [
            'handles posts without app',
            { ...post_data, json_metadata: {} },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
        [
            'handles empty strings as app',
            { ...post_data, json_metadata: { app: '' } },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
        [
            "handles apps that don't exist",
            { ...post_data, json_metadata: { app: 'fakeapp/1.2.3' } },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
        [
            "handles app that don't exist without version",
            { ...post_data, json_metadata: { app: 'fakeapp' } },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
        [
            'handles apps that do exist',
            { ...post_data, json_metadata: { app: 'peakd/1.1.1' } },
            'https://peakd.com/testing/@test/test-post',
        ],
        [
            'handles posts from hive blog',
            { ...post_data, json_metadata: { app: 'hiveblog/0.1' } },
            'https://hive.blog/testing/@test/test-post',
        ],
        [
            'handles posts from app',
            {
                ...post_data,
                json_metadata: { app: `appname/0.1` },
            },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
        [
            'handles badly formatted app strings',
            { ...post_data, json_metadata: { app: 'fakeapp/0.0.1/a////' } },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
        [
            'handles objects as apps',
            { ...post_data, json_metadata: { app: { this_is: 'an objct' } } },
            `${DEFAULT_URL}/testing/@test/test-post`,
        ],
    ];
    test_cases.forEach(v => {
        it(v[0], () => {
            expect(makeCanonicalLink(v[1], v[1].json_metadata)).toBe(v[2]);
        });
    });
});
