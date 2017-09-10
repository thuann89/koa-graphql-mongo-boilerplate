import '../css/style.css';

import { $, $$ } from './modules/bling';
import renderTodo from './modules/renderTodo';
import { addTodo } from './modules/mutationTodo';
// import dismissTodo from './modules/dismissTodo';

import queryTodos from './modules/queryTodos';

queryTodos().then(({data}) => {
  if(!data['todos']) return Promise.reject();
  data['todos'].forEach(item => {
    renderTodo(item.text);
  })
});
// Create a "close" button and append it to each list item
var myNodelist = $$("LI");
if (myNodelist) {
  for (let i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
  }
}


// Click on a close button to hide the current list item
var close = $(".close");
if (close) {
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}


// Add a "checked" symbol when clicking on a list item
var list = $$('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

$('.addBtn').on('click',() => {
  if($("#myInput").value ==='') {
    alert('You must write something');
    return;
  }
  addTodo($("#myInput").value).then(({data}) => {
    if(!data.addTodo) {
      throw new Error('Empty element from server');
    }
    renderTodo(data.addTodo.text);
  });
});


