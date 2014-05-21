define([
	"./core",
	"./core/init",
	"./traversing" // parent, contents
], function( chadQuery ) {

chadQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( chadQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				chadQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = chadQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( chadQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				chadQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = chadQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = chadQuery.isFunction( html );

		return this.each(function( i ) {
			chadQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !chadQuery.nodeName( this, "body" ) ) {
				chadQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});

return chadQuery;
});
