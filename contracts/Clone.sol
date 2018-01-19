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

  // state variables
  uint generation;
  string title;
  bool isPrinting;
  bool needsMaintenance;
  bool inMaintenanceMode;

  // Events
  event titleEvent (
    string _title
  );

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
    bool _inMaintenanceMode
  );

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

  // constructor
  function Clone(uint _generation, string _title) public {
    generation = _generation;
    isPrinting = false;
    needsMaintenance = true;
    inMaintenanceMode = false;
    title = _title;

    generationEvent(generation);
    titleEvent(title);

    // set up default hardware values
    /* setThreadedRod(); */
  }

  /* function setThreadedRod(string _title) private {
    title = _title;
  }
 */

  function getTitle() public view returns (string) {
    return title;
  }

  function setTitle(string _title) public {
    title = _title;
    titleEvent(title);
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

  function setInMaintenanceMode(bool _inMaintenanceMode) public {
    inMaintenanceMode = _inMaintenanceMode;
    inMaintenanceModeEvent(inMaintenanceMode);
  }
}
