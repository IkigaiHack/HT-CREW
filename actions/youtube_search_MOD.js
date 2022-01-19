module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "YouTube Search",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Muzyka",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const info = ['Video URL', 'Video Name', 'Video Description', 'Channel Name', 'Video ID', 'Video Date', 'Video Kind', 'Video Thumbnail (D)', 'Video Thumbnail (M)', 'Video Thumbnail (H)'];
		return `YouTube ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EGGSY",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.9", //Added in 1.8.7

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Searches video informations on YouTube.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown YouTube Type';
		switch (info) {
			case 0:
				dataType = "YouTube Video URL";
				break;
			case 1:
				dataType = "YouTube Video Name";
				break;
			case 2:
				dataType = "YouTube Video Description";
				break;
			case 3:
				dataType = "YouTube Channel Name";
				break;
			case 4:
				dataType = "YouTube Video ID";
				break;
			case 5:
				dataType = "YouTube Video Date";
				break;
			case 6:
				dataType = "YouTube Video Kind";
				break;
			case 7:
				dataType = "YouTube Video Thumbnail (D)";
				break;
			case 8:
				dataType = "YouTube Video Thumbnail (M)";
				break;
			case 9:
				dataType = "YouTube Video Thumbnail (H)";
				break;
		}
		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["video", "key", "info", "resultNo", "storage", "varName"],

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

	html: function (isEvent, data) {
		return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by EGGSY!
			</p>
		</div><br>
	<div style="width: 95%; padding-top: 8px;">
		Wideo do szukania:<br>
		<textarea id="video" rows="2" placeholder="Wpisz nazwe filmu lub użyj zmiennej..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	 </div>
	 <div style="width: 95%; padding-top: 8px;">
	 	Klucz API:<br>
	 	<textarea id="key" rows="2" placeholder="Wpisz swój klucz. Możesz go pozyskać z Google" style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  	</div>
	<div style="float: left; width: 55%; padding-top: 8px;">
		Informacja:<br>
		<select id="info" class="round">
			<option value="0">URL filmu</option>
			<option value="1">Nazwa filmu</option>
			<option value="2">Opis filmu</option>
			<option value="3">Nazwa kanału</option>
			<option value="4">ID filmu</option>
			<option value="5">Data publikacji filmu</option>
			<option value="6">Rodzaj filmu</option>
			<option value="7">Miniatura (domyślne)</option>
			<option value="8">Miniatura (średnia)</option>
			<option value="9">Miniatura (wysoka)</option>
		</select>
	</div>
	<div style="float: left; width: 35%; padding-left: 10px; padding-top: 8px;">
		Numer wyniku:<br>
		<select id="resultNo" class="round">
			<option value="0">1 wynik</option>
			<option value="1">2 wynik</option>
			<option value="2">3 wynik</option>
			<option value="3">4 wynik</option>
			<option value="4">5 wynik</option>
			<option value="5">6 wynik</option>
			<option value="6">7 wynik</option>
			<option value="7">8 wynik</option>
			<option value="8">9 wynik</option>
			<option value="9">10 wynik</option>
		</select>
	</div><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Zapisz  w:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Nazwa zmiennej:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>
	<div style="float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			Aby uzyskać klucz API, utwórz aplikację z uprawnieniami "YouTube Data API v3" na https://console.developers.google.com/apis/dashboard lub sprawdź samouczek, klikając <a href="https://www.youtube.com/watch?v=_HYYJelTExE">tutaj</a>.
		</p>
	<div>
</div>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
		const { glob, document } = this;
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const video = this.evalMessage(data.video, cache);
		const key = this.evalMessage(data.key, cache);
		const resultNumber = parseInt(data.resultNo);

		// Check if everything is ok:
		if (!video) return console.log("Please specify a video name to get video informations.");
		if (!key) return console.log("Please get your key from Google and write it in the field.");

		// Main code:
		var _this = this; // this is needed sometimes.
		const WrexMODS = _this.getWrexMods(); // as always.
		WrexMODS.CheckAndInstallNodeModule('youtube-search');
		const search = WrexMODS.require('youtube-search'); // WrexMODS'll automatically try to install the module if you run it with CMD/PowerShell.

		var opts = {
			maxResults: 10,
			key: `${key}`,
			type: "video"
		}; //Added only video support in 1.9

		search(`${video}`, opts, function (err, results) {
			if (err) return console.log(err);

			switch (info) {
				case 0:
					result = results[resultNumber].link;
					break;
				case 1:
					result = results[resultNumber].title;
					break;
				case 2:
					result = results[resultNumber].description;
					break;
				case 3:
					result = results[resultNumber].channelTitle;
					break;
				case 4:
					result = results[resultNumber].id;
					break;
				case 5:
					result = results[resultNumber].publishedAt;
					break;
				case 6:
					result = results[resultNumber].kind;
					break;
				case 7:
					result = results[resultNumber].thumbnails.default.url;
					break;
				case 8:
					result = results[resultNumber].thumbnails.medium.url;
					break;
				case 9:
					result = results[resultNumber].thumbnails.high.url;
					break;
				default:
					break;
			}
			// Storing:
			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(result, storage, varName2, cache);
			}
			_this.callNextAction(cache);
		});
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) { }

}; // End of module
