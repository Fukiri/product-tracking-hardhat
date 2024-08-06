// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProductTracking {
    struct Product {
        string name;
        string serialNumber;
        string manufacturer;
        string description;
        string[] supplyLineAddresses;
        string currentAddress;
        bool exists;
    }

    mapping(string => Product) private products;

    event ProductUpdated(string serialNumber, string newAddress);

    function addProduct(
        string memory _name,
        string memory _serialNumber,
        string memory _manufacturer,
        string memory _description,
        string[] memory _supplyLineAddresses,
        string memory _currentAddress
    ) public {
        require(!products[_serialNumber].exists, "Product already exists.");

        products[_serialNumber] = Product({
            name: _name,
            serialNumber: _serialNumber,
            manufacturer: _manufacturer,
            description: _description,
            supplyLineAddresses: _supplyLineAddresses,
            currentAddress: _currentAddress,
            exists: true
        });
    }

    function getProduct(string memory _serialNumber)
        public
        view
        returns (
            string memory name,
            string memory serialNumber,
            string memory manufacturer,
            string memory description,
            string[] memory supplyLineAddresses,
            string memory currentAddress
        )
    {
        require(products[_serialNumber].exists, "Product does not exist.");

        Product memory product = products[_serialNumber];
        return (
            product.name,
            product.serialNumber,
            product.manufacturer,
            product.description,
            product.supplyLineAddresses,
            product.currentAddress
        );
    }

    function updateCurrentAddress(string memory _serialNumber, string memory _newAddress) public {
        require(products[_serialNumber].exists, "Product does not exist.");

        products[_serialNumber].currentAddress = _newAddress;
        emit ProductUpdated(_serialNumber, _newAddress);
    }
}
