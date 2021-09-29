# Command a Meet

## About
Arrange a video meeting with Google Meet™ from Mattermost™ just like `/meet (meeting subject)`. It's a fast & easy way to turn a written discussion into a video talk.

### How

A mattermost user can command `/meet` in a channel. This makes a POST request to the Mattermost - Google Meet integration server (this code), that checks de user email, requests a Google Suite event (with a Meet conference) on the users' main calendar, and publishes a Meet link in the same Mattermost channel.


## Table of Contents
- [Installation and setup](#installation-and-setup)
  - [Requirements](#requirements)
  - [Configure Mattermost](#configure-mattermost)
    - [Slash command](#slash-command)
    - [Bot](#bot)
  - [Configure mattermost-meet](#configure-mattermost-meet)
  - [Install and run](#install-and-run)
- [Using the integration](#using-the-integration)
- [License](#license)

--------

## Installation and setup

### Requirements
You will need:
* a Google Suite account, a service account and Domain-Wide Delegation of Authority, as explained in the [Google Identity Platform Guides](https://developers.google.com/identity/protocols/oauth2/service-account)
* a Mattermost installation with [custom slash commands](https://docs.mattermost.com/administration/config-settings.html#enable-custom-slash-commands) and [bot account creation](https://docs.mattermost.com/administration/config-settings.html#bot-accounts) enabled
* a server capable to run node and reachable from your Mattermost server

### Configure Mattermost

####  Slash command

You will need a [custom slash command](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command).

Set the request options:
* Request URL: `http(s)://<yourHost>/meet`
* Request method: POST

and set the other options as you feel like.
* Command Trigger Word: meet
* Autocomplete Hint: [Event subject]
* etc.

#### Bot

[Create a bot](https://docs.mattermost.com/developer/bot-accounts.html#bot-account-creation) to make requests to the Mattermost API.
You will need the token to configure your _Command a meet_ server.

### Configure _Command a meet_

Edit the `config.json` file:
* `google.credentials`: the JSON obtained by creating a private key from the Google service account.
* `mattermost`
  * `api`
    * `url`: Your mattermost API url, usually `https://<yourMattermostHost>/api/v4`
    * `token`: Your bot private token.
  * `slash_command_token`: A token created by Mattermost when you add a slash command. Only requests with this token are accepted.


### Install and run
`npm run deploy` does the job.

This command makes some checks, installs dependencies and runs the server.

## Using the integration
Now you can write `/meet tabs VS spaces` in any Mattermost channel and a public message will link to a Meet.

_Command a meet_ will create a 30' event on your main calendar, called "tabs VS spaces", with a Google Meet conference. Then it will publish a message in your channel with the Google Meet link.

## License
The project is available as open source under the terms of the [Apache 2 License](LICENSE).



Google Meet™ is a trademark of Google LLC.

Mattermost™ is a trademark of Mattermost, inc.

