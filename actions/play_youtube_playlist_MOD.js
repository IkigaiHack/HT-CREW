module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Graj Playliste",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Muzyka",

//---------------------------------------------------------------------
// Requires Audio Libraries
//
// If 'true', this action requires audio libraries to run.
//---------------------------------------------------------------------

requiresAudioLibraries: true,

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.url}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "ZockerNico",

// The version of the mod (Defaults to 1.0.0)
version: "1.0.0",

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "This action is able to add every video in a youtube playlist to the queue.",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
depends_on_mods: [
	{name:'WrexMods',path:'aaa_wrexmods_dependencies_MOD.js'}
],

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["url", "apikey", "seek", "volume", "passes", "bitrate", "results"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions. 
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information, 
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use. 
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels, 
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div class="embed">
    <embedleftline style="background-color: #2b9696;"></embedleftline>
    <div class="embedinfo">
        <span class="embed-auth"><u>Tłumaczenie:</u><br>Stworzono przez <b>Meffiu#9999</b><br>
        <u><span class="wrexlink" data-url="https://www.paypal.com/pools/c/8ar9aXPH54">Wesprzyj!</span></u></span><br>
        <span class="embed-desc">Dodano w: 2.1.1<br></span>
    </div>
</div><br>
<div>
<p>
	Stworzono przez ZockerNico
</p>
</div><br>
<div style="float: left; width: 105%;">
	URL Playlisty:<br>
	<input id="url" class="round" type="text" value="https://www.youtube.com/playlist?list=PLkfg3Bt9RE055BeP8DeDZSUCYxeSLnobe"><br>
</div>
<div style="float: left; width: 105%;">
	Klucz API:<br>
	<input id="apikey" class="round" type="text" placeholder="Wstaw YouTube Data V3 Klucz API..."><br>
</div>
<div style="float: left; width: 49%;">
	Pozycja wyszukiwania filmu:<br>
	<input id="seek" class="round" type="text" value="0"><br>
</div>
<div style="float: right; width: 49%;">
	Filmy wideo:<br>
	<input id="passes" class="round" type="text" value="1">
</div><br>
<div style="float: left; display: table;">
	<div style="display: table-cell;">
		Głośność filmów:<br>
		<input id="volume" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Bitrate filmów:<br>
		<input id="bitrate" class="round" type="text">
	</div>
	<div style="display: table-cell;">
		Max. wyników:<br>
		<input id="results" class="round" type="text" placeholder="Puste - 100...">
	</div>
</div>
<div style="float: left; width: 105%; padding-top: 8px;">
	<p>
		<br>Możesz zostawić "Głośność" & "Bitrate" puste by ustawić automatycznie.
	</p>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];
	const Audio = this.getDBM().Audio;
	const WrexMODS = this.getWrexMods();
	const ypi = WrexMODS.require('youtube-playlist-info');
	const options = {};

	//Check input
	if(!data.url) {
		return console.log('Please insert a playlist url!');
	};
	if(!data.apikey) {
		return console.log('Please insert a api key!');
	};
	
	//Load playlist
	const playlist = this.evalMessage(data.url, cache);
	const playlistID = playlist.slice(38);
	var apikey = "";
	if(data.apikey) {
		apikey = this.evalMessage(data.apikey, cache);
	};
	var results = 100;
	if(data.results) {
		results = parseInt(this.evalMessage(data.results, cache));
	};
	const ypiOptions = {
		maxResults: results
	};
	ypi(apikey, playlistID, ypiOptions).then(items => {
		items.forEach(item=> {
			var url = `https://www.youtube.com/watch?v=${item.resourceId.videoId}`;
			//Set up options
			if(data.seek) {
				options.seek = parseInt(this.evalMessage(data.seek, cache));
			};
			if(data.volume) {
				options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
			} else if(cache.server) {
				options.volume = Audio.volumes[cache.server.id] || 0.5;
			} else {
				options.volume = 0.5;
			};
			if(data.passes) {
				options.passes = parseInt(this.evalMessage(data.passes, cache));
			};
			if(data.bitrate) {
				options.bitrate = parseInt(this.evalMessage(data.bitrate, cache));
			} else {
				options.bitrate = 'auto';
			};
			//Play URL
			if(url) {
				const info = ['yt', options, url];
				Audio.addToQueue(info, cache);
			};
		});
	}).catch(console.error);
	
	this.callNextAction(cache);
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module