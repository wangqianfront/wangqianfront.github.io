function pupopen(boxId) {
		document.getElementById("bg").style.display = "block";
		document.getElementById(boxId).style.display = "block";
		document.body.style.overflow = 'hidden';
	}

	function pupclose(boxId, playId) {
		document.getElementById("bg").style.display = "none";
		document.getElementById(boxId).style.display = "none";
		$f(playId).stop();
		document.body.style.overflow = '';
	}
	
	function viewAndClose(obj) {
		var parent = obj.parentNode;
		var sibling = parent.childNodes;
		var child = obj.childNodes[0];
		var count = 0;
		var i = 0;
		for (i = 0; i < sibling.length; i++) {
			childNode = sibling[i];
			if (count == 2) {
				break;
			}

			if (childNode.nodeName == "#text") {
				continue;
			}

			if (childNode.style.display == "none") {
				childNode.style.display = "";
				child.src = "images/resource/close.gif";
			} else {
				childNode.style.display = "none";
				child.src = "images/resource/viewall.gif";
			}
			count++;
		}
	}
	
	
	function setover(obj) {
		obj.style['opacity'] = 0.5;
		obj.style['filter'] = 'alpha(opacity=50)';
	}
	
	function setout(obj) {
		obj.style['opacity'] = 1;
		obj.style['filter'] = 'alpha(opacity=100)';
	}