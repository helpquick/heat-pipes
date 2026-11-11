
var enabletabpersistence = 1; //enable tab persistence via session only cookies, so selected tab is remembered?
var tabcontentIDs = new Object();

//
//
//

function expandcontent( linkobj )
{
	var ulid = linkobj.parentNode.parentNode.id; //id of UL element
	var ullist = document.getElementById(ulid).getElementsByTagName("li"); //get list of LIs corresponding to the tab contents
	
	for ( var i = 0; i < ullist.length; i++ )
	{
		ullist[i].className = "";  //deselect all tabs
		if ( typeof tabcontentIDs[ulid][i] != "undefined" ) //if tab content within this array index exists (exception: More tabs than there are tab contents)
			document.getElementById( tabcontentIDs[ulid][i] ).style.display = "none"; //hide all tab contents
	}
	linkobj.parentNode.className = "selected";  //highlight currently clicked on tab
	document.getElementById( linkobj.getAttribute("rel") ).style.display = "block"; //expand corresponding tab content
	saveselectedtabcontentid( ulid , linkobj.getAttribute("rel") );
}

//
// Interface for selecting a tab ( plus expand corresponding content ) 
//

function expandtab( tabcontentid , tabnumber )
{
	var thetab = document.getElementById( tabcontentid ).getElementsByTagName("a")[tabnumber];
	if ( thetab.getAttribute("rel") )
		expandcontent( thetab );
}

//
// save ids of tab content divs
//

function savetabcontentids( ulid , relattribute )
{
	//if this array doesn't exist yet
	if ( typeof tabcontentIDs[ulid] == "undefined" )
		tabcontentIDs[ulid] = new Array();
		tabcontentIDs[ulid][tabcontentIDs[ulid].length] = relattribute;
}

//
// set id of clicked on tab as selected tab id & enter into cookie
//

function saveselectedtabcontentid( ulid , selectedtabid )
{ 
	 //if persistence feature turned on
	if ( enabletabpersistence == 1 )
		setCookie( ulid , selectedtabid );
}

//
// returns a tab link based on the ID of the associated tab content
//

function getullistlinkbyId( ulid , tabcontentid )
{
	var ullist = document.getElementById(ulid).getElementsByTagName("li");
	
	for ( var i = 0; i < ullist.length; i++ )
	{
		if ( ullist[i].getElementsByTagName("a")[0].getAttribute("rel") == tabcontentid )
		{
			return ullist[i].getElementsByTagName("a")[0];
			break;
		}
	}
}

//
//
//

function initializetabcontent()
{
	//loop through passed UL ids
	for ( var i = 0; i < arguments.length; i++ )
	{
		//clean up cookie if persist=off
		if ( enabletabpersistence == 0 && getCookie( arguments[i] ) != "" )
			setCookie( arguments[i] , "" );
		
		//retrieve ID of last clicked on tab from cookie, if any
		var clickedontab = getCookie( arguments[i] );
		var ulobj = document.getElementById( arguments[i] );
		
		//array containing the LI elements within UL
		var ulist = ulobj.getElementsByTagName("li");
		
		//loop through each LI element
		for ( var x = 0; x < ulist.length; x++ )
		{
			var ulistlink = ulist[x].getElementsByTagName("a")[0];
			
			if ( ulistlink.getAttribute("rel") )
			{
				//save id of each tab content as loop runs
				savetabcontentids( arguments[i] , ulistlink.getAttribute("rel") );
				
				ulistlink.onclick = function()
				{
					expandcontent(this)
					// return false
				}
				
				//if a tab is set to be selected by default
				if ( ulist[x].className == "selected" && clickedontab == "" )
					//auto load currenly selected tab content
					expandcontent( ulistlink );
					
			}
		} 
		//end inner for loop
		
		//if a tab has been previously clicked on per the cookie value
		if ( clickedontab != "" )
		{
			var culistlink = getullistlinkbyId( arguments[i] , clickedontab );
			
			//if match found between tabcontent id and rel attribute value
			if ( typeof culistlink != "undefined" )
				//auto load currenly selected tab content
				expandcontent( culistlink );
			//else if no match found between tabcontent id and rel attribute value (cookie mis-association)
			else
				//just auto load first tab instead
				expandcontent( ulist[0].getElementsByTagName("a")[0] );
		}
	} //end outer for loop
}


function getCookie( Name )
{ 
	//construct RE to search for target name/value pair
	var re = new RegExp( Name+"=[^;]+" , "i" );
	
	//if cookie found
	if ( document.cookie.match( re ) )
		//return its value
		return document.cookie.match( re )[0].split("=")[1];
		
	return "";
}

function setCookie( name , value )
{
	//cookie value is domain wide (path=/)
	document.cookie = name+"="+value;
}