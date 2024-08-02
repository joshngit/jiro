// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
  function transfer(address _to, uint256 _value) external returns (bool);
  function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
}

// JOC Inter-account Recurring Orders
contract JIRO {

  IERC20 token;
  mapping (address => uint256) credits; // owner => credit
  mapping (address => uint256) debts; // owner => debt

  RecurringOrder[] public ros;
  mapping (address => uint256[]) public roCredits; // token => to => index => RO
  mapping (address => uint256[]) public roDebts; // token => from => index => RO

  struct RecurringOrder {
    address from;
    address to;
    uint256 start;
    uint256 end;
    uint256 interval;
    uint256 amount;
  }

  constructor(address _token) {
    token = IERC20(_token);
    ros.push(RecurringOrder(
      address(0),
      address(0),
      0,
      0,
      0,
      0
    ));
  }

  // ERC20 Compatible
  string public name = 'JPY Saving';
  string public symbol = 'JPYS';
  uint256 public decimals = 0;

  function balanceOf(address _owner) public view returns (uint256) {
    uint256 credit = 0;
    for (uint256 i = 0; i < roCredits[_owner].length; i++) {
      RecurringOrder memory ro = ros[roCredits[_owner][i]];
      if (ro.start <= block.timestamp) {
        if (block.timestamp < ro.end) {
          credit += (block.timestamp - ro.start) / ro.interval * ro.amount;
        } else {
          credit += (ro.end - ro.start) / ro.interval * ro.amount;
        }
      }
    }

    uint256 debt = 0;
    for (uint256 i = 0; i < roDebts[_owner].length; i++) {
      RecurringOrder memory ro = ros[roDebts[_owner][i]];
      if (ro.start <= block.timestamp) {
        if (block.timestamp < ro.end) {
          debt += (block.timestamp - ro.start) / ro.interval * ro.amount;
        } else {
          debt += (ro.end - ro.start) / ro.interval * ro.amount;
        }
      }
    }

    if (credits[_owner] + credit > debts[_owner] + debt) {
      return credits[_owner] + credit - debts[_owner] - debt;
    } else {
      return 0;
    }
  }

  function getAvailable(address _owner) public view returns (uint256) {
    uint256 credit = 0;
    for (uint256 i = 0; i < roCredits[_owner].length; i++) {
      RecurringOrder memory ro = ros[roCredits[_owner][i]];
      if (ro.start <= block.timestamp) {
        if(block.timestamp < ro.end) {
          credit += (block.timestamp - ro.start) / ro.interval * ro.amount;
        } else {
          credit += (ro.end - ro.start) / ro.interval * ro.amount;
        }
      }
    }

    uint256 debt = 0;
    for (uint256 i = 0; i < roDebts[_owner].length; i++) {
      RecurringOrder memory ro = ros[roDebts[_owner][i]];
      debt += (ro.end - ro.start) / ro.interval * ro.amount ;
    }

    if (credits[_owner] + credit > debts[_owner] + debt) {
      return credits[_owner] + credit - debts[_owner] - debt;
    } else {
      return 0;
    }
  }

  function deposit(uint256 _amount) external returns (bool) {
    token.transferFrom(msg.sender, address(this), _amount);
    credits[msg.sender] += _amount;
    return true;
  }

  function withdraw(uint256 _amount) external returns (bool) {
    require(getAvailable(msg.sender) >= _amount, "insufficient fund");
    token.transfer(msg.sender, _amount);
    debts[msg.sender] += _amount;
    return true;
  }

  function transfer(address _to, uint256 _amount) external returns (bool) {
    require(getAvailable(msg.sender) >= _amount, "insufficient available fund");
    debts[msg.sender] += _amount;
    credits[_to] += _amount;
    return true;
  }

  function getReccuringOrder(uint256 _index) external view returns (RecurringOrder memory) {
    return ros[_index];
  }

  function makeReccuringOrder(address _to, uint256 _start, uint256 _end, uint256 _interval, uint256 _amount) external returns (uint256) {
    uint256 total = (_end - _start) / _interval * _amount;
    require(getAvailable(msg.sender) > total, "insufficient fund");
    uint256 id = ros.length;
    roCredits[_to].push(id);
    roDebts[msg.sender].push(id);
    ros.push(RecurringOrder(
      msg.sender,
      _to,
      _start,
      _end,
      _interval,
      _amount
    ));
    return id;
  }

  function removeRecurringOrder(uint256 _index) external returns (bool) {
    RecurringOrder storage ro = ros[_index];
    if (block.timestamp < ro.end) {
      ro.end = block.timestamp;
    } else if (block.timestamp < ro.start) {
      ro.amount = 0;
    }
    return true;
  }

  function getRoCreditLength(address _to) external view returns (uint256) {
    return roCredits[_to].length;
  }

  function getRoDebtLength(address _from) external view returns (uint256) {
    return roDebts[_from].length;
  }
}