<?php

class App 
{
    public function __construct()
    {
        add_action('wp_ajax_get_wishlist', array( $this, 'wf_get_wishlist' ) );
        add_shortcode('woo-favorites',  array( $this, 'wf_shortcode' ) );
    }

    public function wf_shortcode()
    {
        echo '<div id="woo-favorites"></div>';

        wp_enqueue_script( 'wf-app', plugin_dir_url( dirname( __FILE__ ) ) . 'build/index.js', array( 'wp-element', 'wp-components' ), time(), true );
        wp_localize_script('wf-app', 'ajaxObj', array(
           'ajax_url' => admin_url( 'admin-ajax.php' )  
        ));
    }

    public function wf_get_wishlist()
    {   
        
        $args = array(
            'post_type' => 'product',
            'posts_per_page' => -1,
            'post__in' => json_decode($_POST['products'])
        );

        $loop = new WP_Query( $args );
        $array = [];
        if ( $loop->have_posts() ) {
            while ( $loop->have_posts() ) : $loop->the_post(); $product = wc_get_product(get_the_id());
                $current = [
                    'id' => $product->get_id(),
                    'title' => $product->get_title(),
                ];
                $array[] = $current;
            endwhile;
        } else {
            echo __( 'No products found' );
        }
        wp_reset_postdata();

        echo json_encode($array);

        wp_die();
    }
}