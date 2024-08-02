// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract JPY {

  string public name = 'JPY';
  string public symbol = 'JPY';
  uint256 public decimals = 0;
  uint256 public totalSupply = 0;
  uint256 internal constant INITIAL_BALANCE = 100000;
  
  mapping (address => bool) public minters;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) internal allowed;
  mapping (address => bool) internal initialized;
  mapping (address => bool) public spenders;

  modifier onlyMinter() {
    require(minters[msg.sender], "JPY: insufficient minter privilege");
    _;
  }

  constructor() {
    minters[msg.sender] = true;
  }
  
  function addMinter(address _minter) external onlyMinter returns (bool) {
    minters[_minter] = true;
    return true;
  }

  function removeMinter(address _minter) external onlyMinter returns (bool) {
    minters[_minter] = false;
    return true;
  }

  function addSpender(address _spender) external onlyMinter returns (bool) {
    spenders[_spender] = true;
    return true;
  }

  function transfer(address _to, uint256 _value) external returns (bool) {
    require(_to != msg.sender, "JPY: can't transfer to own address");
    require(_value <= balanceOf(msg.sender), "JPY: insufficient fund");

    if (initialized[msg.sender]) {
      balances[msg.sender] = balances[msg.sender] - _value;
    } else {
      balances[msg.sender] = INITIAL_BALANCE - _value;
      initialized[msg.sender] = true;
      emit Transfer(address(0), msg.sender, INITIAL_BALANCE);
    }

    if (initialized[_to]) {
      balances[_to] = balances[_to] + _value;
    } else {
      balances[_to] = INITIAL_BALANCE + _value;
      initialized[_to] = true;
      emit Transfer(address(0), _to, INITIAL_BALANCE);
    }
    
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    if (initialized[_owner]) {
      return balances[_owner];
    } else {
      return INITIAL_BALANCE;
    }
  }

  function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
    require(_to != _from, "JPY: can't transfer to own address");
    require(_value <= balanceOf(_from), "JPY: insufficient fund");
    require(_value <= allowed[_from][msg.sender] || spenders[msg.sender], "JPY: insufficient allowance");

    if (initialized[_from]) {
      balances[_from] = balances[_from] - _value;
    } else {
      balances[_from] = INITIAL_BALANCE - _value;
      initialized[_from] = true;
      emit Transfer(address(0), _from, INITIAL_BALANCE);
    }

    if (initialized[_to]) {
      balances[_to] = balances[_to] + _value;
    } else {
      balances[_to] = INITIAL_BALANCE + _value;
      initialized[_to] = true;
      emit Transfer(address(0), _to, INITIAL_BALANCE);
    }

    if(!spenders[msg.sender]) allowed[_from][msg.sender] = allowed[_from][msg.sender] - _value;
    emit Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) external returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) external view returns (uint256) {
    return allowed[_owner][_spender];
  }
  
  function mint(address _to, uint256 _amount) external onlyMinter returns (bool) {
    if (initialized[_to]) {
      balances[_to] = balances[_to] + _amount;
    } else {
      balances[_to] = INITIAL_BALANCE + _amount;
      initialized[_to] = true;
      emit Transfer(address(0), _to, INITIAL_BALANCE);
    }

    totalSupply = totalSupply + _amount;
    emit Transfer(address(0), _to, _amount);
    return true;
  }
  
  function burn(uint256 _amount) external returns (bool) {
    balances[msg.sender] = balances[msg.sender] - _amount;
    totalSupply = totalSupply - _amount;
    emit Transfer(msg.sender, address(0), _amount);
    return true;
  }
}