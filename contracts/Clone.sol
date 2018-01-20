pragma solidity ^0.4.18;

import './Ownable.sol';
import './Destructible.sol';

contract Clone is Ownable, Destructible {
  // Custom types
  struct ThreadedRod {
    uint id;
    uint diameter;
    string position;
  }

  struct ChromeRod {
    uint id;
    uint diameter;
    string position;
  }

  struct LeadScrew {
    uint id;
    uint diameter;
    string position;
  }

  struct Nut {
    uint id;
    uint diameter;
    string position;
  }

  struct Screw {
    uint id;
    uint diameter;
    string position;
  }

  struct Spool {
    uint id;
    string plasticType;
    uint kgWeight;
    uint diameter;
  }

  struct PSU {
    string voltage;
    string amps;
    string watts;
  }

  struct PowerChord {
    string voltage;
    uint cmLength;
  }

  struct StepperMotor {
    uint id;
    string motorType;
    string axis;
  }

  struct PrintedPart {
    uint id;
    string partType;
    string position;
  }

  struct HeatBed {
    string voltage;
    uint width;
  }

  struct Frame {
    string material;
    uint width;
  }

  struct YCarriage {
    string material;
    uint width;
  }

  struct ZipTie {
    uint id;
    string material;
    uint width;
  }

  struct Fan {
    uint id;
    string fanType;
    uint width;
  }

  struct Endstop {
    uint id;
    string endstopType;
    string position;
  }

  struct Robot {
    uint id;
    address seller;
    address buyer;
    string name;
    uint256 price;
    bool maintenance;
  }

  // state variables
  uint generation;
  bool isPrinting;
  bool needsMaintenance;
  bool inMaintenanceMode;
  uint robotCounter;

  // Associative arrays
  mapping(uint => StepperMotor) public stepperMotors;
  mapping(uint => ThreadedRod) public threadedRods;
  mapping(uint => ChromeRod) public chromeRods;
  mapping(uint => LeadScrew) public leadScrews;
  mapping(uint => Nut) public nuts;
  mapping(uint => Screw) public screws;
  mapping(uint => PrintedPart) public printedParts;
  mapping(uint => ZipTie) public zipTies;
  mapping(uint => Fan) public fans;
  mapping(uint => Endstop) public endstops;
  mapping(uint => Robot) public robots;

  // Events
  event generationEvent (
    uint _generation
  );

  event printEvent (
    bool _isPrinting
  );

  event needsMaintenanceEvent (
    bool _needsMaintenance
  );

  event inMaintenanceModeEvent (
    uint _id,
    bool _inMaintenanceMode
  );

  event createRobotEvent (
    uint indexed _id,
    address indexed _seller,
    string _name,
    uint256 _price,
    bool _maintenance
  );

  event buyRobotEvent (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // constructor
  function Clone(uint _generation) public {
    generation = _generation;
    isPrinting = false;
    needsMaintenance = true;
    inMaintenanceMode = false;

    generationEvent(generation);

    // set up default hardware values
    /* setThreadedRod(); */
  }

  // sell an robot
  function createRobot(string _name, uint256 _price) public {
    // a new robot
    robotCounter++;

    // store this robot
    robots[robotCounter] = Robot(
      robotCounter,
      msg.sender,
      0x0,
      _name,
      _price,
      false
    );

    // trigger the event
    createRobotEvent(robotCounter, msg.sender, _name, _price, false);
  }

  // fetch the number of robots in the contract
  function getNumberOfRobots() public constant returns (uint) {
    return robotCounter;
  }


  // fetch and returns all robot IDs available for sale
  function getRobotsForSale() public constant returns (uint[]) {
    // we check whether there is at least one robot
    if(robotCounter == 0) {
      return new uint[](0);
    }

    // prepare intermediary array
    uint[] memory robotIds = new uint[](robotCounter);

    uint numberOfRobotsForSale = 0;
    // iterate over robots
    for (uint i = 1; i <= robotCounter; i++) {
      // keep only the ID of robots not sold yet
      if (robots[i].buyer == 0x0) {
        robotIds[numberOfRobotsForSale] = robots[i].id;
        numberOfRobotsForSale++;
      }
    }

    // copy the articleIds array into the smaller forSale array
    uint[] memory forSale = new uint[](numberOfRobotsForSale);
    for (uint j = 0; j < numberOfRobotsForSale; j++) {
      forSale[j] = robotIds[j];
    }
    return (forSale);
  }

  function getGeneration() public view returns (uint) {
    return generation;
  }

  function setGeneration(uint _generation) public {
    generation = _generation;
    generationEvent(generation);
  }

  function getIsPrinting() public view returns (bool) {
    return isPrinting;
  }

  function setisPrinting(bool _isPrinting) public {
    isPrinting = _isPrinting;
    printEvent(isPrinting);
  }

  function startPrinting() public {
    isPrinting = true;
    printEvent(isPrinting);
  }

  function stopPrinting() public {
    isPrinting = false;
    printEvent(isPrinting);
  }

  function getNeedsMaintenance() public view returns (bool) {
    return needsMaintenance;
  }

  function setNeedsMaintenance(bool _needsMaintenance) public {
    needsMaintenance = _needsMaintenance;
    needsMaintenanceEvent(needsMaintenance);
  }

  function getInMaintenanceMode() public view returns (bool) {
    return inMaintenanceMode;
  }

  function setInMaintenanceMode(uint _id, bool _inMaintenanceMode) public {
    Robot storage robot = robots[_id];
    robot.maintenance = _inMaintenanceMode;

    inMaintenanceModeEvent(_id, robot.maintenance);
  }
}
