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

  it("...should need maintenance", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.getNeedsMaintenance.call();
    }).then(function(needsMaintenance) {
      assert.equal(needsMaintenance, true, "The Clone should need maintenance.");
    });
  });

  it("...should not need maintenance", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.setNeedsMaintenance(false);
    }).then(function() {
      return cloneInstance.getNeedsMaintenance.call();
    }).then(function(needsMaintenance) {
      assert.equal(needsMaintenance, false, "The Clone should not need maintenance.");
    });
  });

  it("...should not be being repaired", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.getIsBeingRepaired.call();
    }).then(function(isBeingRepaired) {
      assert.equal(isBeingRepaired, false, "The Clone should not be being repaired.");
    });
  });

  it("...should be being repaired", function() {
    return Clone.deployed().then(function(instance) {
      cloneInstance = instance;
      return cloneInstance.setIsBeingRepaired(true);
    }).then(function() {
      return cloneInstance.getIsBeingRepaired.call();
    }).then(function(isBeingRepaired) {
      assert.equal(isBeingRepaired, true, "The Clone should be being repaired.");
    });
  });
});
