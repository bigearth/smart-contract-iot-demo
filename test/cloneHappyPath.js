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
