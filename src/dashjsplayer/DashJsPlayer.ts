/*
 * Copyright 2024-2025 Amazon.com, Inc. or its affiliates. All rights reserved.
 *
 * AMAZON PROPRIETARY/CONFIDENTIAL
 *
 * You may not use this file except in compliance with the terms and
 * conditions set forth in the accompanying LICENSE.TXT file.
 *
 * THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY
 * DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS,
 * IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
 */

// @ts-nocheck
import { PlayerInterface } from "../PlayerInterface";
import { HTMLMediaElement } from "@amazon-devices/react-native-w3cmedia/dist/headless";
import * as dashTs from "./dist/dash.all.min";

const SEEKTIME = 10;

export class DashJsPlayer implements PlayerInterface {
    player: dashTs.MediaPlayer | null = null;
    private mediaElement: HTMLMediaElement | null;
    constructor(mediaElement: HTMLMediaElement | null) {
        this.mediaElement = mediaElement;
    }

    load(content: any, autoplay: boolean) {
        this.onDashMediaPlayerError = this.onDashMediaPlayerError.bind(this);
        this.onDashMediaPlayerLog = this.onDashMediaPlayerLog.bind(this);
        this.onDashMediaPlayerManifest = this.onDashMediaPlayerManifest.bind(this);

        console.log("DashPlayer:creating dash player");
        this.player = dashTs.MediaPlayer().create();
        this.player?.on("error", this.onDashMediaPlayerError);
        this.player?.on("log", this.onDashMediaPlayerLog);
        this.player?.on("manifestLoaded", this.onDashMediaPlayerManifest);
        this.player?.on("streamInitialized", this.onDashMediaPlayerStreamInitialized);
        this.player?.on("public_protectioncreated", this.onDashMediaPlayerProtectionCreated);
        this.player?.initialize(this.mediaElement, null, autoplay);
        console.log("DashPlayer:initialize");

        if (content.drm_scheme !== null && content.drm_scheme !== "") {
            console.log(`dashjsplayer: loading with ${content.drm_scheme} and ${content.drm_license_uri} and ${content.secure}`);
            let signal_secure : string = 'SW_SECURE_CRYPTO';
            let audio_not_secure : string = 'SW_SECURE_CRYPTO';
            if (content.drm_scheme === 'com.microsoft.playready') {
                signal_secure = '150';
            }

            if (content.secure === "true") {
                if (content.drm_scheme === 'com.microsoft.playready') {
                    signal_secure = '3000';
                } else {
                    signal_secure = 'HW_SECURE_ALL';
                }
            }
            
            const protData = {
               [content.drm_scheme]: {
                    serverURL: content.drm_license_uri,
                    audioRobustness: audio_not_secure,
                    videoRobustness: signal_secure,
                    priority: 1
                }
            };

            if (content.hasOwnProperty('drm_license_header')) {
                content.drm_license_header.map((values) => {
                   protData[content.drm_scheme].httpRequestHeaders[values[0] as string] = values[1] as string;
                });
            }

            this.player?.setProtectionData(protData);
            console.log("DashPlayer:setProtectionData");
        }

        this.player?.updateSettings({
            'debug': {
                'logLevel': dashjs.Debug.LOG_LEVEL_INFO
            }
        });

        this.player?.attachSource(content.uri);
        console.log("DashPlayer:attachSource");
    }

    play(): void {
        this.player?.play();
    }

    pause(): void {
        this.player?.pause();
    }

    seekBack(): void {
        const time = this.player?.time();
        if (time) {
            console.log("dashplayer: seekBack to ", time - SEEKTIME);
            this.player.seek(time - SEEKTIME);
        }
    }

    seekFront(): void {
        const time = this.player?.time();
        if (time) {
            console.log("dashplayer: seekFront to ", time + SEEKTIME);
            this.player.seek(time + 10);
        }
    }

    unload(): void {
        console.log('dashplayer:unload');
    }

    playbackRate(playbackrate: number): void {
        const playbackrate_ = this.player.getPlaybackRate();
        console.log("dashplayer: set playbackRate from  " + playbackrate_ + "to" + playbackrate);
        this.player.setPlaybackRate(playbackrate);
    }

    volume(volumelevel: number): void {
        const volumeLevel_ = this.player.getVolume();
        console.log("dashplayer: set volume level from  " + volumeLevel_ + "to" + volumelevel);
        this.player.setVolume(volumelevel);
    }

    mute(mute: boolean): void {
        const muted_ = this.player.isMuted();
        console.log("dashplayer: set mute from  " + muted_ + "to" + mute);
        this.player.setMute(mute);
    }

    getAudioLanguages(): string[] {
        return this.player.getTracksFor("audio");
    }

    selectAudioLanguage(language: string): void {
        this.player.selectAudioLanguage(language);
    }

    private onDashMediaPlayerError(e: dashTs.ErrorEvent) {
        console.log(`onDashMediaPlayerError: ${JSON.stringify(e.type)}: ${JSON.stringify(e.error)}`);
    }
    private onDashMediaPlayerLog(e: dashTs.LogEvent) {
        console.log(`onDashMediaPlayerLog: ${JSON.stringify(e.type)} ${JSON.stringify(e.message)}`);
    }
    private onDashMediaPlayerManifest(e: dashTs.ManifestLoadedEvent) {
        console.log(`onDashMediaPlayerManifest: ${JSON.stringify(e.type)} ${JSON.stringify(e.data)}`);
    }

    private onDashMediaPlayerStreamInitialized(e: dashTs.StreamInitializedEvent) {
        console.log(`onDashMediaPlayerStreamInitialized: ${JSON.stringify(e.type)} ${JSON.stringify(e.data)}`);
    }

    private onDashMediaPlayerProtectionCreated(e: dashTs.ProtectionCreatedEvent) {
        console.log(`onDashMediaPlayerProtectionCreated: ${JSON.stringify(e.type)} ${JSON.stringify(e.data)}`);
    }
}