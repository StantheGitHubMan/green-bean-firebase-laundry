
var firebase_sandbox ='https://spam.firebaseio.com'    //'firstbuild-sandbox.firebaseio.com'

var os = require('os');
var Firebase = require('firebase');
var ref = new Firebase(firebase_sandbox);
var userchk;
//Sets User Table**************************************************************
ref.child('Users').child('Jane').child('Uses').set(10,function(err){});
ref.child('Users').child('Jane').child('BlueTooth Tag').set('x.123456.x',function(err){});
ref.child('Users').child('John').child('Uses').set(3,function(err){});
ref.child('Users').child('John').child('BlueTooth Tag').set('x.123478.x',function(err){});
ref.child('Users').child('Bill').child('Uses').set(2,function(err){});
ref.child('Users').child('Bill').child('BlueTooth Tag').set('x.543216.x',function(err){});
ref.child('Users').child('Ghost').child('Uses').set(0,function(err){});
ref.child('Users').child('Ghost').child('BlueTooth Tag').set('x.XXXXXX.x',function(err){});
//*******************************************************************************

//Sets Up Current Machine Table************************************************
ref.child('Current Machine').set('Dryer 1',function(err){});
//Sets Machine Tracking Table////////
ref.child('Available Machines').child('Dryer 1').child('Machine Usage Table').child('2015').child('April').child('11').child('Times Used').set(11,function(err){});
	//Sets Machine Status//
ref.child('Available Machines').child('Dryer 1').child('Machine Status').set(0,function(err){});
//*******************************************************************************

//Setting Current User Value***************************************************
var user = 'Bill';
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
//var userchk;
ref.child('Current User').on("value", function(snapshot){userchk =snapshot.val();},function (errorObject){console.log("The read failed: "+errorObject.code);

//console.log("User Check Says:",userchk);//Troubleshooting

/*	if(userchk!='Jane')
	{
	console.log("Its not Jane");
	}
	else
	{
	console.log("Its Jane");
	}*/
	ref.child('Current User').off();
});

var name=[];
var uses=[];
var userarray = [];
var peeps = [];
var GTG = 0;
ref.child('Users').on('child_added',function(snap){
name.push(snap.key());
//uses.push(snap.val()['uses']);
//userarray.push({Username: name, Uses: uses});

//console.log(name[1]);
//console.log(uses[1]);
//console.log(userarray[1]);

//ref.child('Users').push({Username: name, Uses: uses});
var y = 0;
/*for(x in peeps){
//	console.log(x)
	userarray[y] = x;
//	console.log(userarray[y]);
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

//console.log("GTG:",GTG);
});
return(1);//GTG);
}//END OF USERCHK FUNCTION******************************************************

//Compare Function For Auth************************************************
function compare(chekd, wreked)
{

var value = 0;

if(chekd == wreked)
{
value = 1;
var authuser;
ref.child('Current User').on("value", function(snapshot){authuser =snapshot.val();},function (errorObject){console.log("The read failed: "+errorObject.code)});
         //var contentchg ={'Uses': 9};
	 //ref.child('Users').child(authuser).update(contentchg,function(err){});
}
else
{
value = 0;
}
inc = getvalue(userchk);
//console.log("Get Wrcked!",value);
return(value);
}//END COMPARE**************************************************************

//Get value Function********************************************************
function getvalue(usname)
{
var custom=0;
ref.child('Users').child('usname').on("value",function(snapshot){custom = snapshot.val();},function(err){});

return(custom);
}
//BEGIN MAIN??******************************************************************
//Setup the Green Bean
var greenBean = require("green-bean");
greenBean.connect("laundry",function(laundry){
var ipcontent = {IP_Address: ip_address('wlan0')||null}; //Calls IP Address
ref.child('Available Machines').child('Dryer 1').child('Green Bean').update(ipcontent,function(err){});

var result = 0;
result = compare(checkUser(),1);
//console.log("Result:",result);



//Add in Bluetooth check****************************************************************************************************************************************




var inc =1;
var watcher = 0;
inc = getvalue(userchk);
var contentchg ={'Uses': inc};
var runs = {'Times Used':run};
var run = 0;
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
          ref.child('Available Machines').child('Dryer 1').update(content, function(err){});
console.log("Watcher is: ",watcher);
//LOGIC CODE FOR INCREMENTING**************************************************
//*****************************************************************************
if (value ==2&&watcher ==0) 
{
watcher = 1;
inc++;
console.log("Watcher 1");
console.log(value," ",watcher," ",result);
}

else if(value == 3 && watcher == 1 &&result ==0) //Ghost Catcher
{
watcher = 0;
contentchg ={'Uses': inc};
ref.child('Users').child('Ghost').update(contentchg,function(err){});
runs = {'Times Used':run};
ref.child('Available Machines').child('Dryer 1').child('Machine Usage Table').child('2015').child('April').child('11').update(runs, function(err){});
result = compare(checkUser(),1);
}

else if(value == 3 &&watcher ==1&&result ==1)
{
 
watcher =0;
var authuser;
ref.child('Current User').on("value", function(snapshot){authuser =snapshot.val();},function (errorObject){console.log("The read failed: "+errorObject.code)});
         contentchg ={'Uses': inc};
	 ref.child('Users').child(authuser).update(contentchg,function(err){});
console.log("Triggered!",inc);
run++;
runs = {'Times Used':run};
ref.child('Available Machines').child('Dryer 1').child('Machine Usage Table').child('2015').child('April').child('11').update(runs, function(err){});
result = compare(checkUser(),1);
}

	 });
});

