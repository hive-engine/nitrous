import assert from 'assert';
import secureRandom from 'secure-random';
import links, * as linksRe from 'app/utils/Links';
import youtubeRegex from 'app/components/elements/EmbeddedPlayers/youtube';
import threespeakRegex from 'app/components/elements/EmbeddedPlayers/threespeak';
import twitterRegex from 'app/components/elements/EmbeddedPlayers/twitter';
import spotifyRegex from 'app/components/elements/EmbeddedPlayers/spotify';
import mixcloudRegex from 'app/components/elements/EmbeddedPlayers/mixcloud';
import archiveorg from 'app/components/elements/EmbeddedPlayers/archiveorg';
import bandcamp from 'app/components/elements/EmbeddedPlayers/bandcamp';
import redditRegex from 'app/components/elements/EmbeddedPlayers/reddit';
import gist from 'app/components/elements/EmbeddedPlayers/gist';
import truvvl from 'app/components/elements/EmbeddedPlayers/truvvl';
import { PARAM_VIEW_MODE, VIEW_MODE_WHISTLE } from '../../shared/constants';

describe('Links', () => {
    it('all', () => {
        match(
            linksRe.any(),
            "https://example.com/wiki/Poe's_law",
            "https://example.com/wiki/Poe's_law"
        );
        match(linksRe.any(), "https://example.com'", 'https://example.com');
        match(linksRe.any(), '"https://example.com', 'https://example.com');
        match(linksRe.any(), 'https://example.com"', 'https://example.com');
        match(linksRe.any(), "https://example.com'", 'https://example.com');
        match(linksRe.any(), 'https://example.com<', 'https://example.com');
        match(linksRe.any(), 'https://example.com>', 'https://example.com');
        match(linksRe.any(), 'https://example.com\n', 'https://example.com');
        match(linksRe.any(), ' https://example.com ', 'https://example.com');
        match(linksRe.any(), 'https://example.com ', 'https://example.com');
        match(linksRe.any(), 'https://example.com.', 'https://example.com');
        match(
            linksRe.any(),
            'https://example.com/page.',
            'https://example.com/page'
        );
        match(linksRe.any(), 'https://example.com,', 'https://example.com');
        match(
            linksRe.any(),
            'https://example.com/page,',
            'https://example.com/page'
        );
    });
    it('multiple matches', () => {
        const all = linksRe.any('ig');
        let match = all.exec('\nhttps://example.com/1\nhttps://example.com/2');
        assert.equal(match[0], 'https://example.com/1');
        match = all.exec('https://example.com/1 https://example.com/2');
        assert.equal(match[0], 'https://example.com/2');
    });
    it('by domain', () => {
        const locals = [
            'https://localhost/',
            `http://appdomain`,
            `http://appdomain/group`,
        ];
        match(linksRe.local()('appdomain'), locals);

        const remotes = ['https://example.com/', 'http://abc.co'];
        matchNot(linksRe.local()('appdomain'), remotes);
    });
    it('by image', () => {
        match(linksRe.image(), 'https://example.com/a.jpeg');
        match(linksRe.image(), 'https://example.com/a/b.jpeg');
        match(
            linksRe.image(),
            '![](https://example.com/img2/nehoshtanit.jpg)',
            'https://example.com/img2/nehoshtanit.jpg'
        );
        match(
            linksRe.image(),
            '<img src="https://example.com/img2/nehoshtanit.jpg"',
            'https://example.com/img2/nehoshtanit.jpg'
        );
        match(
            linksRe.image(),
            'http://example.com\nhttps://example.com/a.jpeg',
            'https://example.com/a.jpeg'
        );
        match(
            linksRe.image(),
            'http://i.imgur.com/MWufFQi.jpg")',
            'http://i.imgur.com/MWufFQi.jpg'
        );
        matchNot(linksRe.image(), [
            'http://imgur.com/iznWRVq',
            'https://openmerchantaccount.com/',
        ]);
    });
});

describe('makeParams', () => {
    it('creates an empty string when there are no params', () => {
        assert(linksRe.makeParams([]) === '', 'not empty on array');
        assert(linksRe.makeParams({}) === '', 'not empty on object');
        assert(
            linksRe.makeParams({}, false) === '',
            'not empty on object with prefix false'
        );
        assert(
            linksRe.makeParams([], false) === '',
            'not empty on array with prefix false'
        );
        assert(
            linksRe.makeParams([], '?') === '',
            'not empty on array with prefix string'
        );
        assert(
            linksRe.makeParams({}, '?') === '',
            'not empty on object  with prefix string'
        );
    });
    it('creates the correct string when passed an array', () => {
        assert(
            linksRe.makeParams(['bop=boop', 'troll=bridge']) ===
                '?bop=boop&troll=bridge',
            'incorrect string with'
        );
        assert(
            linksRe.makeParams(['bop=boop', 'troll=bridge'], false) ===
                'bop=boop&troll=bridge',
            'incorrect string with prefix false'
        );
        assert(
            linksRe.makeParams(['bop=boop', 'troll=bridge'], '&') ===
                '&bop=boop&troll=bridge',
            'incorrect string with prefix &'
        );
    });
    it('creates the correct string when passed an object', () => {
        assert(
            linksRe.makeParams({ bop: 'boop', troll: 'bridge' }) ===
                '?bop=boop&troll=bridge',
            'incorrect string'
        );
        assert(
            linksRe.makeParams({ bop: 'boop', troll: 'bridge' }, false) ===
                'bop=boop&troll=bridge',
            'incorrect string with prefix false'
        );
        assert(
            linksRe.makeParams({ bop: 'boop', troll: 'bridge' }, '&') ===
                '&bop=boop&troll=bridge',
            'incorrect string with prefix &'
        );
    });
});

describe('determineViewMode', () => {
    it('returns empty string when no parameter in search', () => {
        assert(
            linksRe.determineViewMode('') === '',
            linksRe.determineViewMode('') + 'not empty on empty string'
        );
        assert(
            linksRe.determineViewMode('?afs=asdf') === '',
            'not empty on incorrect parameter'
        );
        assert(
            linksRe.determineViewMode('?afs=asdf&apple=sauce') === '',
            'not empty on incorrect parameter'
        );
    });

    it('returns empty string when unrecognized value for parameter in search', () => {
        assert(
            linksRe.determineViewMode(`?${PARAM_VIEW_MODE}=asd`) === '',
            'not empty on incorrect parameter value'
        );
        assert(
            linksRe.determineViewMode(
                `?${PARAM_VIEW_MODE}=${VIEW_MODE_WHISTLE}1`
            ) === '',
            'not empty on incorrect parameter value'
        );
        assert(
            linksRe.determineViewMode(
                `?${PARAM_VIEW_MODE}=asdf&apple=sauce`
            ) === '',
            'not empty on incorrect parameter value'
        );
        assert(
            linksRe.determineViewMode(
                `?apple=sauce&${PARAM_VIEW_MODE}=asdf`
            ) === '',
            'not empty on incorrect parameter value'
        );
    });
    it('returns correct value when recognized value for parameter in search', () => {
        assert(
            linksRe.determineViewMode(
                `?${PARAM_VIEW_MODE}=${VIEW_MODE_WHISTLE}`
            ) === VIEW_MODE_WHISTLE,
            'wrong response on correct parameter'
        );
        assert(
            linksRe.determineViewMode(
                `?${PARAM_VIEW_MODE}=${VIEW_MODE_WHISTLE}&apple=sauce`
            ) === VIEW_MODE_WHISTLE,
            'wrong response on correct parameter'
        );
        assert(
            linksRe.determineViewMode(
                `?apple=sauce&${PARAM_VIEW_MODE}=${VIEW_MODE_WHISTLE}`
            ) === VIEW_MODE_WHISTLE,
            'wrong response on correct parameter'
        );
    });
});

// 1st in the browser it is very expensive to re-create a regular expression many times, however, in nodejs is is very in-expensive (it is as if it is caching it).
describe('Performance', () => {
    const largeData = secureRandom.randomBuffer(1024 * 10).toString('hex');
    it('any, ' + largeData.length + ' bytes x 10,000', () => {
        for (let i = 0; i < 10000; i++) {
            const match = (largeData + 'https://example.com').match(
                linksRe.any()
            );
            assert(match, 'no match');
            assert(match[0] === 'https://example.com', 'no match');
        }
    });
    it('image (large), ' + largeData.length + ' bytes x 10,000', () => {
        for (let i = 0; i < 10000; i++) {
            matchNot(
                linksRe.image(),
                'https://lh3.googleusercontent.com/OehcduRZPcVIX_2tlOKgYHADtBvorTfL4JtjfGAPWZyiiI9p_g2ZKEUKfuv3By-aiVfirXaYvEsViJEbxts6IeVYqidnpgkkkXAe0Q79_ARXX6CU5hBK2sZaHKa20U3jBzYbMxT-OVNX8-JYf-GYa2geUQa6pVpUDY35iaiiNBObF-TMIUOqm0P61gCdukTFwLgld2BBlxoVNNt_w6VglYHJP0W4izVNkEu7ugrU-qf2Iw9hb22SGIFNpbzL_ldomDMthIuYfKSYGsqe2ClvNKRz-_vVCQr7ggRXra16uQOdUUv5IVnkK67p9yR8ioajJ4tiGdzazYVow46pbeZ76i9_NoEYnOEX2_a7niofnC5BgAjoQEeoes1cMWVM7V8ZSexBA-cxmi0EVLds4RBkInvaUZjVL7h3oJ5I19GugPTzlyVyYtkf1ej6LNttkagqHgMck87UQGvCbwDX9ECTngffwQPYZlZKnthW0DlkFGgHN8T9uqEpl-3ki50gTa6gC0Q16mEeDRKZe7_g5Sw52OjMsfWxmBBWWMSHzlQKKAIKMKKaD6Td0O_zpiXXp7Fyl7z_iESvCpOAUAIKnyJyF_Y0UYktEmw=w2066-h1377-no'
            );
        }
    });
    it('image, ' + largeData.length + ' bytes x 10,000', () => {
        for (let i = 0; i < 10000; i++) {
            const match = (largeData + 'https://example.com/img.jpeg').match(
                linksRe.image()
            );
            assert(match, 'no match');
            assert(match[0] === 'https://example.com/img.jpeg', 'no match');
        }
    });
    it('remote, ' + largeData.length + ' bytes x 10,000', () => {
        for (let i = 0; i < 10000; i++) {
            const match = (largeData + 'https://example.com').match(
                linksRe.remote()
            );
            assert(match, 'no match');
            assert(match[0] === 'https://example.com', 'no match');
        }
    });
    it('youTube', () => {
        match(youtubeRegex.main, 'https://youtu.be/xG7ajrbj4zs?t=7s');
        match(
            youtubeRegex.main,
            'https://www.youtube.com/watch?v=xG7ajrbj4zs&t=14s'
        );
        match(
            youtubeRegex.main,
            'https://www.youtube.com/watch?v=xG7ajrbj4zs&feature=youtu.be&t=14s'
        );
    });
    it('youTubeId', () => {
        match(
            youtubeRegex.contentId,
            'https://youtu.be/xG7ajrbj4zs?t=7s',
            'xG7ajrbj4zs',
            1
        );
        match(
            youtubeRegex.contentId,
            'https://www.youtube.com/watch?v=xG7ajrbj4zs&t=14s',
            'xG7ajrbj4zs',
            1
        );
        match(
            youtubeRegex.contentId,
            'https://www.youtube.com/watch?v=xG7ajrbj4zs&feature=youtu.be&t=14s',
            'xG7ajrbj4zs',
            1
        );
    });
    it('threespeak', () => {
        match(
            threespeakRegex.main,
            'https://3speak.co/watch?v=artemislives/tvxkobat'
        );
        match(
            threespeakRegex.main,
            'https://3speak.tv/watch?v=artemislives/tvxkobat'
        );
        match(
            threespeakRegex.main,
            'https://3speak.co/watch?v=artemislives/tvxkobat&jwsource=cl'
        );
        match(
            threespeakRegex.main,
            'https://3speak.tv/watch?v=artemislives/tvxkobat&jwsource=cl'
        );
        match(
            threespeakRegex.main,
            'https://3speak.co/embed?v=artemislives/tvxkobat'
        );
        match(
            threespeakRegex.main,
            'https://3speak.tv/embed?v=artemislives/tvxkobat'
        );
    });
    it('threespeakId', () => {
        match(
            threespeakRegex.main,
            'https://3speak.co/watch?v=artemislives/tvxkobat',
            'artemislives/tvxkobat',
            1
        );
        match(
            threespeakRegex.main,
            'https://3speak.co/watch?v=artemislives/tvxkobat&jwsource=cl',
            'artemislives/tvxkobat',
            1
        );
        match(
            threespeakRegex.main,
            'https://3speak.tv/embed?v=artemislives/tvxkobat',
            'artemislives/tvxkobat',
            1
        );

        match(
            threespeakRegex.main,
            'https://3speak.tv/watch?v=artemislives/tvxkobat',
            'artemislives/tvxkobat',
            1
        );
        match(
            threespeakRegex.main,
            'https://3speak.tv/watch?v=artemislives/tvxkobat&jwsource=cl',
            'artemislives/tvxkobat',
            1
        );
        match(
            threespeakRegex.main,
            'https://3speak.tv/embed?v=artemislives/tvxkobat',
            'artemislives/tvxkobat',
            1
        );
    });
    it('threespeakImageLink', () => {
        match(
            threespeakRegex.htmlReplacement,
            '<a href="https://3speak.co/watch?v=artemislives/tvxkobat" rel="noopener" title="This link will take you away from steemit.com" class="steem-keychain-checked"><img src="https://images.hive.blog/768x0/https://img.3speakcontent.online/tvxkobat/post.png"></a>'
        );
    });
    it('twitter', () => {
        match(
            twitterRegex.main,
            'https://twitter.com/quochuync/status/1274676558641299459'
        );
        match(
            twitterRegex.sanitize,
            'https://twitter.com/quochuync/status/1274676558641299459?ref_src=something'
        );
        match(
            twitterRegex.htmlReplacement,
            '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Dear government and elites in the UK, a short thread about your attempted suppression of Tommy Robinson through your ability to control private enterprises like Twitter, Facebook and YouTube /1</p>&mdash; 🇮🇱Dr BrianofLondon.me (@brianoflondon) <a href="https://twitter.com/brianoflondon/status/1219518959168389121?ref_src=twsrc%5Etfw">January 21, 2020</a></blockquote>'
        );
        match(
            twitterRegex.htmlReplacement,
            '<blockquote><p>Dear government and elites in the UK, a short thread about your attempted suppression of Tommy Robinson through your ability to control private enterprises like Twitter, Facebook and YouTube /1</p>&amp;mdash; 🇮🇱Dr BrianofLondon.me (<a href="/@brianoflondon" class="keychainify-checked">@brianoflondon</a>) <a href="https://twitter.com/brianoflondon/status/1219518959168389121?ref_src=twsrc%5Etfw" rel="nofollow noopener" title="This link will take you away from hive.blog">January 21, 2020</a></blockquote>'
        );
    });
    it('reddit', () => {
        match(
            redditRegex.main,
            'https://www.reddit.com/r/Kefir/comments/l1ntst/is_this_kahn_yeast_its_always_start_appearing/'
        );
        match(
            redditRegex.sanitize,
            'https://www.reddit.com/r/Kefir/comments/l1ntst/is_this_kahn_yeast_its_always_start_appearing/'
        );
        match(
            redditRegex.htmlReplacement,
            '<blockquote class="reddit-card" data-card-created="1614855336"><a href="https://www.reddit.com/r/CryptoCurrency/comments/lxcmup/to_all_the_small_hodlers_keeping_your_coins_at_an/">To all the small hodlers, keeping your coins at an exchange might be the best thing for you</a> from <a href="http://www.reddit.com/r/CryptoCurrency">r/CryptoCurrency</a></blockquote>\n' +
                '<script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>'
        );
        match(
            redditRegex.htmlReplacement,
            '<blockquote class="reddit-card" data-card-created="1614855336"><a href="https://www.reddit.com/r/CryptoCurrency/comments/lxcmup/to_all_the_small_hodlers_keeping_your_coins_at_an/">To all the small hodlers, keeping your coins at an exchange might be the best thing for you</a> from <a href="http://www.reddit.com/r/CryptoCurrency">r/CryptoCurrency</a></blockquote>\n' +
                '<script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>'
        );
    });
    it('spotify', () => {
        match(
            spotifyRegex.main,
            'https://open.spotify.com/playlist/37i9dQZF1DWSDCcNkUu5tr?si=WPhzYzqATGSIa0d3kbNgBg'
        );
        match(
            spotifyRegex.main,
            'https://open.spotify.com/show/37i9dQZF1DWSDCcNkUu5tr?si=WPhzYzqATGSIa0d3kbNgBg'
        );
        match(
            spotifyRegex.main,
            'https://open.spotify.com/episode/37i9dQZF1DWSDCcNkUu5tr?si=WPhzYzqATGSIa0d3kbNgBg'
        );
        match(
            spotifyRegex.sanitize,
            'https://open.spotify.com/embed/playlist/37i9dQZF1DWSDCcNkUu5tr'
        );
        match(
            spotifyRegex.sanitize,
            'https://open.spotify.com/embed-podcast/show/37i9dQZF1DWSDCcNkUu5tr'
        );
        match(
            spotifyRegex.sanitize,
            'https://open.spotify.com/embed-podcast/episode/37i9dQZF1DWSDCcNkUu5tr'
        );
    });
    it('mixcloud', () => {
        match(
            mixcloudRegex.main,
            'https://www.mixcloud.com/MagneticMagazine/ambient-meditations-vol-21-anane/',
            'https://www.mixcloud.com/MagneticMagazine/ambient-meditations-vol-21-anane'
        );
        match(
            mixcloudRegex.sanitize,
            'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FMagneticMagazine%2Fambient-meditations-vol-21-anane%2F'
        );
    });
    it('archiveorg', () => {
        match(archiveorg.main, 'https://archive.org/details/geometry_dash_1.9');
        match(
            archiveorg.sanitize,
            'https://archive.org/embed/geometry_dash_1.9'
        );
    });
    it('bandcamp', () => {
        match(
            bandcamp.sanitize,
            'https://bandcamp.com/EmbeddedPlayer/album=313320652/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/'
        );
    });
    it('gist', () => {
        match(
            gist.main,
            'https://gist.github.com/huysbs/647a50197b95c4027550a2cc558af6aa'
        );
        match(
            gist.sanitize,
            'https://gist.github.com/huysbs/647a50197b95c4027550a2cc558af6aa.js'
        );
        match(
            gist.htmlReplacement,
            '<script src="https://gist.github.com/huysbs/647a50197b95c4027550a2cc558af6aa.js"></script>'
        );
    });
    it('truvvl', () => {
        match(
            truvvl.main,
            'https://travelfeed.io/@tvt3st/prague-to-sarajevo-cool-places-in-europe-europe-prague-zagreb-bosnia-20210420t103208397z'
        );
        match(
            truvvl.sanitize,
            'https://embed.truvvl.com/@tvt3st/prague-to-sarajevo-cool-places-in-europe-europe-prague-zagreb-bosnia-20210420t103208397z'
        );
    });
});

const match = (...args) => compare(true, ...args);
const matchNot = (...args) => compare(false, ...args);
const compare = (matching, re, input, output = input, pos = 0) => {
    if (Array.isArray(input)) {
        for (let i = 0; i < input.length; i++)
            compare(matching, re, input[i], output[i]);
        return;
    }
    // console.log('compare, input', input)
    // console.log('compare, output', output)
    const m = input.match(re);
    if (matching) {
        assert(
            m,
            `No match --> ${input} --> output ${
                output
            } --> using ${re.toString()}`
        );
        // console.log('m', m)
        assert.equal(
            m[pos],
            output,
            `Unmatched ${m[pos]} --> input ${input} --> output ${
                output
            } --> using ${re.toString()}`
        );
    } else {
        assert(
            !m,
            `False match --> input ${input} --> output ${
                output
            } --> using ${re.toString()}`
        );
    }
};
