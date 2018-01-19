pragma solidity ^0.4.18;

contract Clone {
  // Custom types
  struct Spool {
    uint id;
    string plasticType;
    uint kgWeight;
    uint diameter;
  }

  struct PSU {
    uint id;
    string voltage;
    string amps;
    string watts;
  }

  // state variables
  uint generation;
  string title;
  bool isPrinting;
  bool needsMaintenance;
  bool isBeingRepaired

  // constructor
  function Clone(uint _generation) public {
    generation = _generation;
    isPrinting = false;
    needsMaintenance = false;
    isBeingRepaired = false;
  }

  function setTitle(string _title) public {
    title = _title;
  }

  function getTitle() public view returns (string) {
    return title;
  }

  function setGeneration(uint _generation) public {
    generation = _generation;
  }

  function getGeneration() public view returns (uint) {
    return generation;
  }

  function setisPrinting(bool _isPrinting) public {
    isPrinting = _isPrinting;
  }

  function getIsPrinting() public view returns (bool) {
    return isPrinting;
  }

  function startPrinting() public {
    isPrinting = true;
  }

  function stopPrinting() public {
    isPrinting = false;
  }
  }
