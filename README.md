# toothub

A hub for many tooters

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/lmorchard/toothub?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status via Travis CI](https://travis-ci.org/lmorchard/toothub.svg?branch=master)](https://travis-ci.org/lmorchard/toothub)
[![Coverage](https://coveralls.io/repos/lmorchard/toothub/badge.png)](https://coveralls.io/r/lmorchard/toothub)
[![Quality](https://codeclimate.com/github/lmorchard/toothub.png)](https://codeclimate.com/github/lmorchard/toothub)
[![Dependencies](https://david-dm.org/lmorchard/toothub.png)](https://david-dm.org/lmorchard/toothub)
[![devDependency Status](https://david-dm.org/lmorchard/toothub/dev-status.svg)](https://david-dm.org/lmorchard/toothub#info=devDependencies)
[![Tips](http://img.shields.io/gittip/lmorchard.png)](https://www.gittip.com/lmorchard/)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## The Idea

Picture a world of tooters, just tooting out loud to themselves. They have no
easy way to share their toots or to discover the toots of others.

But, one day there appeared a hub of toots. People can tell the hub that they
are tooting, and the hub happily gathers their toots all together in one place
for everyone to see.

Suddenly, people can visit the hub and experience toots from other people all
around the world. In fact, people can toot at each other, and the hub will
pass the toots around. People can also toot at funny words, and everyone can
see all the toots gathered around that word.

The toot hub is a wonderful place to discover toots. 

But, what's even more wonderful is that people discovered they could conjure
up hubs of their own - for friends, colleagues, or even just themselves. 

These new hubs could be open to all, or keep a bouncer at the door checking
for invitations. Some hubs could be private, quietly watching the out loud
toots of other people for shy owners.

## What?

* Toot = Tiny outburst of text

* You need a [tootr](https://github.com/lmorchard/tootr) to toot your own
  horn.

## No seriously what?

This is (or will be) an experiment in semi-distributed microblogging using mostly boring
old formats and microformats on the web. In other words, it's like a Twitter
that's not all in one place.

It should be easy to publish little thoughts in a space that's yours. It
should be not much harder to set up a place where lots of people's thoughts
come together. There should be more than one place where thoughts come
together - some public and inclusive, some private and exclusive. We shouldn't
all be cooped up in one silo where a single landlord has control over
everything.

## Principles

* Make this thing simple to initially deploy, possible to upgrade later

## TODO

* HTTP API

  * registering a toot stream

  * pings for when a toot stream changes

    * rssCloud / PuSH compatible or inspired 

* Poll toot streams, periodically and on ping

* Aggregate the toots

* Index #hashtags and @replies

  * Optional webhook to receive real-time-ish @replies

* Use an in-memory 'database' at first - cheap, but dies with reboots

  * Should probably be fine for dozens to hundreds of users?

  * Optional state snapshots saved to S3 or Dropbox, loaded on startup

* Optional upgrade to a MongoDB instance - eg. [mongolab](https://mongolab.com/)

* Optional publishing of public viewable pages to S3

  * Only use the app for registration and aggregation

  * All feed views get statically published

* Optionally provide websocket firehoses?

  * @replies, #hashtags, etc

* Reply semantics?

* Auth / privacy

  * Invite-only mode

  * Identity / role restricted aggregation views

  * Someday, play with GPG for encrypted toots for private groups and direct
    messages

* Inter-hub shenanigans

  * Let hubs advertise to each other?

  * Collect #hashtag toots from many hubs

  * More?

<!-- vim: set wrap wm=5 syntax=mkd textwidth=78: -->
