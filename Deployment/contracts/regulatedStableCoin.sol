// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./Owner.sol";

contract regulatedStableCoin is Owner{

    string public symbol;
    string public name;
    uint256 public decimals;
    uint256 public totalSupply;
    bool public paused;

    mapping(address => mapping(address => uint256)) allowed;
    mapping(address => uint256) internal balances;
    mapping(address => bool) internal frozen;
        
    event accountBalanceUpdate(address indexed Account, uint256 balances);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // PAUSABLE EVENTS
    event Pause();
    event Unpause();

    // ASSET PROTECTION EVENTS
    event FrozenAddressWiped(address indexed addr);
    event FreezeAddress(address indexed addr);
    event UnfreezeAddress(address indexed addr);

    event SupplyDecreased(address indexed from, uint256 value);
    event SupplyIncreased(address indexed to, uint256 value);

    error AddressNotFrozen();
    error ContractPaused();
    error AlreadyPaused();
    error AlreadyUnPaused();
    error InsufficientFunds();

    constructor( 
        string memory _name, 
        string memory _symbol, 
        uint256 _decimals, 
        uint256 _totalSupply
    ) 
        public 
    {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
        emit accountBalanceUpdate(msg.sender, _totalSupply);
        emit SupplyIncreased(msg.sender, _totalSupply);
    }

    modifier whenNotPaused() {
        if (_isPaused()) revert ContractPaused();
        _;
    }

    function _isPaused() internal view returns (bool) {
        return paused;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function allowance(address _owner, address _spender) public view returns (uint256){
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal returns (bool){
        require(balances[_from] >= _value, "Insufficient balance");
        balances[_from] = balances[_from] - _value;
        balances[_to] = balances[_to] + _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool) {
        require(_transfer(msg.sender, _to, _value), "transfer fail");
        emit accountBalanceUpdate(msg.sender, balanceOf(msg.sender));
        emit accountBalanceUpdate( _to, balanceOf(_to));
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool){
        require(allowed[_from][msg.sender] >= _value, "Insufficient allowance");
        allowed[_from][msg.sender] = allowed[_from][msg.sender] - _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function _freeze(address addr) private {
        frozen[addr] = true;
        emit FreezeAddress(addr);
    }

    function freeze(address addr) public onlyOwner{
        _freeze(addr);
    }

    function _unfreeze(address addr) private {
        delete frozen[addr];
        emit UnfreezeAddress(addr);
    }

    function unfreeze(address addr) public onlyOwner {
        _unfreeze(addr);
    }

    function wipeFrozenAddress(address addr) public onlyOwner {
            if (!_isAddrFrozen(addr)) revert AddressNotFrozen();
            uint256 balance = balances[addr];
            balances[addr] = 0;
            totalSupply -= balance;
            emit FrozenAddressWiped(addr);
            emit SupplyDecreased(addr, balance);
            emit Transfer(addr, address(0), balance);
    }

    function isFrozen(address addr) external view returns (bool) {
        return _isAddrFrozen(addr);
    }

    function _isAddrFrozen(address addr) internal view  returns (bool) {
        return frozen[addr];
    }

    function decreaseSupplyFromAddress(uint256 value, address burnFromAddress) public virtual returns (bool success) {

        if (value > balances[burnFromAddress]) revert InsufficientFunds();

        balances[burnFromAddress] -= value;
        totalSupply -= value;
        emit SupplyDecreased(burnFromAddress, value);
        emit Transfer(burnFromAddress, address(0), value);
        return true;
    }


    function decreaseSupply(uint256 value) public returns (bool success) {
        return decreaseSupplyFromAddress(value, msg.sender);
    }


    function burn(uint256 amount) public {
        decreaseSupply(amount);
    }


    function increaseSupplyToAddress(uint256 value, address mintToAddress) internal virtual returns (bool success) {
        require(!_isAddrFrozen(mintToAddress), "mintToAddress frozen");
        totalSupply += value;
        balances[mintToAddress] += value;
        emit SupplyIncreased(mintToAddress, value);
        emit Transfer(address(0), mintToAddress, value);
        return true;

    }

    function increaseSupply(uint256 value) public onlyOwner returns (bool success) {
        return increaseSupplyToAddress(value, msg.sender);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        increaseSupplyToAddress(amount, account);
    }

    function pause() public onlyOwner {
        if (paused) revert AlreadyPaused();
        paused = true;
        emit Pause();
    }

    function unpause() public onlyOwner {
        if (!paused) revert AlreadyUnPaused();
        paused = false;
        emit Unpause();
    }

}