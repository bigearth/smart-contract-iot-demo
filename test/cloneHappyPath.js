var Clone = artifacts.require("./Clone.sol");

contract('Clone', function(accounts) {

  it("...should be a Generation 1 machine", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.getGeneration.call();
    }).then(function(generation) {
      assert.equal(generation, 1, "This should be a Generation 1 machine");
    });
  });

  it("...should set to Generation 2", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.setGeneration(2);
    }).then(function() {
      return cloneInstance.getGeneration.call();
    }).then(function(generation) {
      assert.equal(generation, 2, "This should set to Generation 2");
    });
  });

  it("...should have a title", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.setTitle("EARTH Clone");
    }).then(function() {
      return cloneInstance.getTitle.call();
    }).then(function(title) {
      assert.equal(title, "EARTH Clone", "The title should be 'EARTH Clone'");
    });
  });

  it("...should not be printing", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.getIsPrinting.call();
    }).then(function(isPrinting) {
      assert.equal(isPrinting, false, "The Clone should not be printing.");
    });
  });

  it("...should start printing", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.startPrinting();
    }).then(function() {
      return cloneInstance.getIsPrinting.call();
    }).then(function(isPrinting) {
      assert.equal(isPrinting, true, "The Clone should be printing.");
    });
  });

  it("...should stop printing", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.stopPrinting();
    }).then(function() {
      return cloneInstance.getIsPrinting.call();
    }).then(function(isPrinting) {
      assert.equal(isPrinting, false, "The Clone should not be printing.");
    });
  });
});
