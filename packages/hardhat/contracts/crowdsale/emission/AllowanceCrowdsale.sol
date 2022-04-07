// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Crowdsale.sol";
import "../../token/ERC20/IERC20.sol";
import "../../token/ERC20/utils/SafeERC20.sol";
import "../../utils/math/SafeMath.sol";
import "../../utils/math/Math.sol";

/**
 * @title AllowanceCrowdsale
 * @dev Extension of Crowdsale where tokens are held by a wallet, which approves an allowance to the crowdsale.
 */
abstract contract AllowanceCrowdsale is Crowdsale {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address private _tokenWallet;

    /**
     * @dev Constructor, takes token wallet address.
     * @param tokenWallet_ Address holding the tokens, which has approved allowance to the crowdsale.
     */
    constructor (address tokenWallet_) {
        require(tokenWallet_ != address(0), "AllowanceCrowdsale: token wallet is the zero address");
        _tokenWallet = tokenWallet_;
    }

    /**
     * @return the address of the wallet that will hold the tokens.
     */
    function tokenWallet() public view returns (address) {
        return _tokenWallet;
    }

    /**
     * @dev Checks the amount of tokens left in the allowance.
     * @return Amount of tokens left in the allowance
     */
    function remainingTokens() public view returns (uint256) {
        return Math.min(token().balanceOf(_tokenWallet), token().allowance(_tokenWallet, address(this)));
    }

    /**
     * @dev Overrides parent behavior by transferring tokens from wallet.
     * @param beneficiary Token purchaser
     * @param tokenAmount Amount of tokens purchased
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) virtual override internal {
        token().safeTransferFrom(_tokenWallet, beneficiary, tokenAmount);
    }
}
