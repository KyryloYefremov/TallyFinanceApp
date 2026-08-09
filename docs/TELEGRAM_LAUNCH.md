# Telegram Mini App Launch Guide

**Created**: 2026-08-09
**Updated**: 2026-08-09

## Overview

This guide describes how to make the TallyFinanceApp Mini App available through
Telegram. It covers bot creation, web application requirements, hosting, domain
linking, launch buttons, and launch testing.

## 1. Creating a Bot in Telegram

A Mini App works through a bot that sends a link to the application to users.

To create a bot:

1. Open Telegram and go to [@BotFather](https://t.me/BotFather).
1. Send the `/newbot` command and follow the instructions.
1. Specify the bot's name and its unique username. The username must end with
   `bot`, for example `my_mini_app_bot`.
1. Get the API token. You will need it to integrate the Mini App with Telegram.

You can also configure:

- Bot description: `/setdescription`.
- Commands: `/setcommands`.
- Avatar: `/setuserpic`.

## 2. Developing the Web Application

A Mini App is a regular web application adapted to work in Telegram.

Main requirements:

- HTTPS support. A secure connection is mandatory.
- Correct display on mobile devices and in the desktop version of Telegram.
- Ability to interact with the Telegram Web Apps API.

If the application has only a static interface, such as a simple form or a
product catalog, HTML, CSS, and JavaScript can be enough. For more complex
solutions, such as order processing or authorization, a server-side part is
required.

## 3. Hosting on a Server

Telegram requires the Mini App to work over HTTPS.

Hosting options:

- Free services for static sites: Vercel, Netlify, Firebase Hosting.
- Cloud servers: Yandex Cloud, Mail.ru Cloud, Selectel.
- Your own hosting, if full customization and control are required.

When hosting, make sure the site is accessible through a direct link and loads
without errors.

## 4. Linking the Mini App to the Bot

For users to be able to open the Mini App, it needs to be linked to the bot
using the `/setdomain` command in BotFather:

1. Open [@BotFather](https://t.me/BotFather).
1. Enter the `/setdomain` command.
1. Specify the URL where your application is hosted, for example
   `https://my-mini-app.vercel.app`.

After this, Telegram will consider this domain trusted and allow it to be opened
inside WebView.

## 5. Adding a Button to Launch the Mini App

For users to be able to open the Mini App, the bot must send them a button with
a link to the application.

You can use an inline button. It needs to be programmed into the chatbot logic
and included in a message from the bot. The button appears in the chat with the
bot and lets the user open the Mini App with a single tap.

## 6. Testing and Launching

Before distributing the Mini App, test it on different devices:

- Mobile Telegram on Android and iOS: make sure the interface is responsive.
- Desktop Telegram: check that the application displays correctly.

Also check:

- Launching the Mini App through the bot.
- Display and operation of the interface.
- Correctness of data transfer between the Mini App and the bot.
