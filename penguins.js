// controller
var PenguinController = function(penguinView, penguinModel) {

  this.onClickGetPenguin = function(e) {
    // `penguinIndex` stored as "data-penguin-index" attr on the HTML
    // button, and retrieved with `dataset` from the DOMStringMap
    var index = parseInt(e.currentTarget.dataset.penguinIndex, 10);
    penguinModel.getPenguin(index, this.showPenguin.bind(this));
  }

  this.showPenguin = function(penguinModelData) {
    // penguinViewModel calculate previousIndex and nextIndex, adds them
    // to the object, and render it
    var penguinViewModel = {
      name: penguinModelData.name,
      imageUrl: penguinModelData.imageUrl,
      size: penguinModelData.size,
      favoriteFood: penguinModelData.favoriteFood
    };

    penguinViewModel.previousIndex = penguinModelData.index - 1;
    penguinViewModel.nextIndex = penguinModelData.index + 1;
    if (penguinModelData.index === 0) {
      penguinViewModel.previousIndex = penguinModelData.count - 1;
    }
    if (penguinModelData.index === penguinModelData.count - 1) {
      penguinViewModel.nextIndex = 0;
    }

    penguinView.render(penguinViewModel);
  };

  penguinView.onClickGetPenguin = this.onClickGetPenguin.bind(this)
}

var PenguinView = function(rootEl) {

  this.render = function(viewModel) {
    rootEl.innerHTML = '<h3>' + viewModel.name + '</h3>' +
      '<img class="penguin-image" src="' + viewModel.imageUrl +
        '" alt="' + viewModel.name + '"/>' +
        '<p><b>Size: </b>' + viewModel.size + '</p>' +
        '<p><b>Favorite food: </b>' + viewModel.favoriteFood + '</p>' +
        '<a id="previousButton" class="previous button" href="javascript:void(0);"' +
          'data-penguin-index="' + viewModel.previousIndex + '">Previous</a>' +
        '<a id="nextButton" class="next button" href="javascript:void(0);"' +
          'data-penguin-index="' + viewModel.nextIndex + '">Next</a>'

    var previousButton = rootEl.querySelector('#previousButton');
    previousButton.addEventListener('click', this.onClickGetPenguin);

    var nextButton = rootEl.querySelector('#nextButton');
    nextButton.addEventListener('click', this.onClickGetPenguin);
  };
};

// model
var PenguinModel = function PenguinModel() {
  this.getPenguin = function getPenguin(index, fn) {
    var oReq = new XMLHttpRequest();

    oReq.onload = function onLoad(e) {
      var ajaxResponse = JSON.parse(e.currentTarget.responseText);
      var penguin = ajaxResponse[index];

      penguin.index = index;
      penguin.count = ajaxResponse.length;

      fn(penguin);
    };

    oReq.open('GET', 'https://codepen.io/beautifulcoder/pen/vmOOLr.js', true);
    oReq.send();
  };
};

var penguinModel = new PenguinModel;
var penguinView = new PenguinView(document.getElementById('root'));
var controller = new PenguinController(penguinView, penguinModel)

// simulate an onClickGetPenguin with a mock `e.currentTarget.dataset.penguinIndex` event to get the first penguin
controller.onClickGetPenguin({ currentTarget: { dataset: { penguinIndex: 0 }}});
