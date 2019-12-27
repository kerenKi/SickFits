import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles'
import User from './User';

function Nav(props) {
  return (
      <User>
        { (payload) => {
          const { me } = payload.data
          return (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>
            { me && (
              <>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
                
                <Link href="/orders">
                  <a>Orders</a>
                </Link>

                <Link href="/me">
                  <a>Account</a>
                </Link>
              </>
            )}
            
            {!me && <Link href="/signup">
              <a>Signin</a>
            </Link>}
            
          </NavStyles>
          )}
        }
      </User>
      
  );
}

export default Nav;