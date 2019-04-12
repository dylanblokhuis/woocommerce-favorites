import Cookies from 'universal-cookie';

class Wishlist extends React.Component {
  triggerEvent() {
    this.products.toggle();
  }

  render() {  
    return (
      <div class="wishlist-wrapper">
        <OpenWishlist onClick={this.triggerEvent.bind(this)} />
        <Products ref={ products => this.products = products }/>
      </div>
    );
  }
}

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product_ids: [],
      wishlist: [],
      IsToggled: false,
    };

    const cookies = new Cookies();
    cookies.set('posts_in_wishlist', [239, 238, 227, 226], { path: '/' });  
  }
  
  toggle() {
    console.log('is toggled');
    this.setState({
      IsToggled: !this.state.IsToggled
    })
  }

  async getProducts() {
    const formData = new FormData();
    formData.append('action', 'get_wishlist');

    const response = await fetch(ajaxObj.ajax_url, {
      method: 'POST',
      body: formData,
      credentials: "same-origin"
    });

    const json = await response.json();
    console.log(json);
    this.setState({ wishlist: json })
  }
  
  async componentDidMount() {
    const cookies = new Cookies();
    const formData = new FormData();

    formData.append('action', 'get_wishlist');
    formData.append('products', JSON.stringify(cookies.get('posts_in_wishlist')));

    const response = await fetch(ajaxObj.ajax_url, {
      method: 'POST',
      body: formData,
      credentials: "same-origin"
    });

    const json = await response.json();
    console.log(json);
    this.setState({ wishlist: json })
  }

  render() {
    this.products = this.state.wishlist.map((product, key) =>
      <li key={product.id}>{product.title}</li>
    );

    if (this.props.IsToggle) {
      return (
        <ul class="wishlist-items">
            {this.products}
        </ul>
      ); 
    } else {
      return false;
    }
  }
}

class OpenWishlist extends React.Component {
  render() {
    return (
      <div className="wishlist-icon" onClick={this.props.onClick}>
        <img src="http://uwbusinessonline.site/nutspecials.nl/wp-content/uploads/2019/04/favorite-heart-button.svg"/>
      </div>
    );
  }
}

wp.element.render(
  <Wishlist/>, 
  document.getElementById('woo-favorites')
);