# Example Media Players 2020-07-23

## dapplr direct html iframe markup

<iframe src="https://cdn.dapplr.in/file/dapplr-videos/cryptoanalysis/yuHDBQG8XY3IBMwD0f4je9b1P7u7PAsT.mp4"></iframe>

## dapplr iframe embedded from link

Not supported


## dtube direct html iframe markup

<iframe title="DTube embedded player" src="https://emb.d.tube/#!/cyberspacegod/QmfHTqZWQkJ6uqLsca4wgZffGE3To6YVSzazFD3ReS1NcA"></iframe>

## dtube iframe embedded from link

https://emb.d.tube/#!/cyberspacegod/QmfHTqZWQkJ6uqLsca4wgZffGE3To6YVSzazFD3ReS1NcA


## soundcloud direct html iframe markup

<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>

## soundcloud iframe embedded from link

Not supported


## threespeak direct html iframe markup

<iframe src="https://3speak.online/embed?v=threespeak/iaarkpvf"></iframe>

## threespeak iframe embedded from link

It's broken

https://3speak.online/watch?v=threespeak/iaarkpvf


## twitch direct html iframe markup

It's broken, because we don't set parameter `parent` in url query. Iframe's attribute `src` should be something like `https://player.twitch.tv/?<channel, video, or collection>&parent=streamernews.example.com`. From their docs: "parent string (required) Domain(s) that will be embedding Twitch. You must have one parent key for each domain your site uses."

<iframe src="https://player.twitch.tv/?channel=tfue" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>


## twitter

https://twitter.com/missybahia/status/1281295770298318849


## vimeo direct html iframe markup

<iframe src="https://player.vimeo.com/video/179213493"></iframe>

## vimeo iframe embedded from link

Looks broken…

https://player.vimeo.com/video/179213493


## youtube direct html iframe markup

<iframe src="https://www.youtube.com/embed/KOnk7Nbqkhs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## youtube iframe embedded from link

https://www.youtube.com/embed/KOnk7Nbqkhs
