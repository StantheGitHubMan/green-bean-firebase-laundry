
var firebase_sandbox ='https://spam.firebaseio.com'    //'firstbuild-sandbox.firebaseio.com'

var os = require('os');
var Firebase = require('firebase');
var ref = new Firebase(firebase_sandbox);

//Sets User Table**************************************************************
ref.child('Users').child('Jane').child('Uses').set(10,function(err){});
ref.child('Users').child('Jane').child('BlueTooth Tag').set('x.123456.x',function(err){});
ref.child('Users').child('John').child('Uses').set(3,function(err){});
ref.child('Users').child('John').child('BlueTooth Tag').set('x.123478.x',function(err){});
ref.child('Users').child('Bill').child('Uses').set(2,function(err){});
ref.child('Users').child('Bill').child('BlueTooth Tag').set('x.543216.x',function(err){});
//*******************************************************************************

//Sets Up Current Machine Table************************************************
ref.child('Current Machine').set('Dryer 1',function(err){});
//Sets Machine Tracking Table////////
ref.child('Available Machines').child('Dryer 1').child('Machine Usage Table').child('2015').child('April').child('11').child('Times Used').set(11,function(err){});
	//Sets Machine Status//
ref.child('Available Machines').child('Dryer 1').child('Machine Status').set(0,function(err){});
//*******************************************************************************

//Setting Current User Value***************************************************
var user = 'Jane';
var userinfo = {User: user};
ref.child('Current User').set(user,function(err){});
//******************************************************************************

//Finding IP Address************************************************************
function ip_address(interface)
{
var items = os.networkInterfaces()[interface]||[];

return items
.filter(function(item)
{
return item.family.toLowerCase()=='ipv4';
})
.map(function(item)
{
return item.address;
})
.shift();
}
//End of IP ADDRESS FUNCTION***************************************************

//Begin User Check Function****************************************************
//Pulling in current User information

function checkUser()
{
var userchk;
ref.child('Current User').on("value", function(snapshot){userchk =snapshot.val();},function (errorObject){console.log("The read failed: "+errorObject.code);

console.log("User Check Says:",userchk);//Troubleshooting

	if(userchk!='Jane')
	{
	console.log("Its not Jane");
	}
	else
	{
	console.log("Its Jane");
	}
	ref.child('Current User').off();
});

//Setting up Check with Children of Users
//******************************************ADD LENGTH CHECK FOR CHILDREN TO SET ARRAY TO************************************


var name=[];
var uses=[];
var userarray = [];
var peeps = [];
var GTG = 0;
ref.child('Users').on('child_added',function(snap){
name.push(snap.key());
//uses.push(snap.val()['uses']);
//userarray.push({Username: name, Uses: uses});

console.log(name[1]);
//console.log(uses[1]);
//console.log(userarray[1]);

//ref.child('Users').push({Username: name, Uses: uses});
var y = 0;
/*for(x in peeps){
	console.log(x)
	userarray[y] = x;
	console.log(userarray[y]);
	y++;
}*/
for(y=0; y<name.length;y++)
{
	if(userchk == name[y])
	{
	GTG = 1;
	break;
	}
	else{
	GTG = 0;
	}
}

console.log("GTG:",GTG);
});
return(1);//GTG);
}//END OF USERCHK FUNCTION******************************************************

//BEGIN MAIN??******************************************************************
//Setup the Green Bean
var greenBean = require("green-bean");
greenBean.connect("laundry",function(laundry){
var ipcontent = {IP_Address: ip_address('wlan0')||null}; //Calls IP Address
ref.child('Available Machines').child('Dryer 1').child('Green Bean').update(ipcontent,function(err){});



var promise = new Promise(function(1,0){
//if(



checkUser();
promise.done(if(checkUser()==1) //Checks that user is correct
{
console.log("Jane is correct");
}
else
{
console.log("Nope thats not quite right");
}




//Add in Bluetooth check****************************************************************************************************************************************






//Finish Cycle and charge account * Started Below *
      // subscribe to the end of cycle
      console.log("Subscribing to machineStatus.");

      // https://github.com/GEMakers/gea-plugin-laundry#laundrymachinestatus
      laundry.machineStatus.subscribe(function (value) {

          // get the push for end of cycle
          console.log("machineStatus:", value);

          // if(value){  // <--- That's gonna be zero...

          // current_machine_status will be !OVERWRITTEN! after every status change.
          content ={'Machine Status': value};
          ref.child('Available Machines').child('Dryer 1').update(content, function(err) {});
    });
});

