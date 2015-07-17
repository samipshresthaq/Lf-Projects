;(function(){
	'use strict';

	var invites = document.getElementsByClassName('invites')[0];
	var requests = document.getElementsByClassName('requests')[0];

	invites.onclick = function(){
		update(this);
	}

	requests.onclick = function(){
		update(this);
	}

	function update(div_) {
		var div = div_;
		var counter = div.children[0].children[1].children[0].innerHTML;
		counter++;

		if(div === invites)
			div.children[0].children[0].setAttribute('class','invites-icon active');

		else if(div === requests)
			div.children[0].children[0].setAttribute('class','requests-icon active');

		
		div.children[0].children[1].children[0].innerHTML = counter;
	}
})();