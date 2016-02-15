var old_page_pos = 0;
var scrollInside = false;

var section_scroller_1 = {  
    old_page_pos : 0,
    scrollInside : false };

var section_scroller_2 = {  
    old_page_pos : 0,
    scrollInside : false };

$(document).scroll(function() {
    magic_func("container", 6, section_scroller_1 );
    magic_func("another", 6, section_scroller_2 );
});


$( window ).load(function() {
    set_container_inside_pos("container", 6);
    set_container_inside_pos("another", 6);
});

/** set_container_inside_pos
*   id: id of html element with scroll inside and overflow hidden.
*   nrPages: nr pages to slide in.
*
*   verifies if the container is above or below the middle of the screen, 
*   if is below set the element current offset to last "page".
*/
var set_container_inside_pos = function (id, nrPages) {

    var container = $("#" + id);
    //viewport height
    var vh = $(window).height(); 
    // offset from vh start to document start.
    var current_page_pos = $('body').scrollTop();
    //offset from container to document start
    var container_pos = container.offset().top;
    // offset inside container.
    var container_inside_pos = container.scrollTop();
    //container declared height
    var container_height = container.height(); //px
    //nr pages - 1
    var max_scroll_in = container_height * (nrPages - 1);
    //page offset + half viewport - works as a mark 
    var middle_vh_pos = current_page_pos + (0.5 * vh); 
    //container offset + half declared height of container
    var trigger_middle_container = container_pos + (container_height * 0.5); 

    if(middle_vh_pos >= trigger_middle_container){
        container.scrollTop(max_scroll_in);
    }
};





var magic_func = function(id, nrPages, scope){


    /** 
    *   useful variables
    */
    var container = $("#" + id);
    //viewport height
    var vh = $(window).height(); 
    // offset from vh start to document start.
    var current_page_pos = $('body').scrollTop();
    //amount of scroll: positive number means down, negative means up.
    var scroll_delta = current_page_pos - scope.old_page_pos;
    //offset from container to document start
    var container_pos = container.offset().top;
    // offset inside container.
    var container_inside_pos = container.scrollTop();
    //container declared height
    var container_height = container.height(); //px
    //nr pages - 1
    var max_scroll_in = container_height * (nrPages - 1);
    //page offset + half viewport - works as a mark 
    var middle_vh_pos = current_page_pos + (0.5 * vh); 
    //container offset + half declared height of container
    var trigger_middle_container = container_pos + (container_height * 0.5); 

    var toggle_scroll_inside = function(){
        scope.scrollInside = !scope.scrollInside;
        $("#" + id + " .slide").toggleClass("slide--fixed");
    }

    var set_new_positions = function(outside_pos, inside_pos, should_update_old_pos){
        $(document).scrollTop(outside_pos);
        container.scrollTop(inside_pos);

        if(should_update_old_pos){
            scope.old_page_pos = outside_pos;
        }
    }

    if(scope.scrollInside){
        //down and new position inside container reaches end
        if(scroll_delta >= 0 && (container_inside_pos + scroll_delta >= max_scroll_in)){ 
            scroll_delta_in = max_scroll_in;
            scroll_delta_out = container_inside_pos + scroll_delta - scroll_delta_in;

            toggle_scroll_inside();
            set_new_positions(scope.old_page_pos + scroll_delta_out, scroll_delta_in, true);
        }
        //up and new position inside container reaches top
        else if(scroll_delta < 0 && (container_inside_pos + scroll_delta <= 0)){
            scroll_delta_in = 0;
            scroll_delta_out = scroll_delta + container_inside_pos;

            toggle_scroll_inside();
            set_new_positions(scope.old_page_pos + scroll_delta_out, scroll_delta_in, true);
        }
        else{
            set_new_positions(scope.old_page_pos, container_inside_pos + scroll_delta, false);
        }
    }
    else{
        //scroll down outside and find trigger
        if(scroll_delta >= 0 && (middle_vh_pos >= trigger_middle_container) && container_inside_pos === 0 ){
            scroll_delta_in = 1; // if scrolling outside and find trigger scroll inside 1px
            scroll_delta_out = trigger_middle_container - (0.5 * vh);

            toggle_scroll_inside();
            set_new_positions(scroll_delta_out, scroll_delta_in , true);
        }
        //scroll up outside and find trigger
        else if(scroll_delta < 0 && (middle_vh_pos < trigger_middle_container) && container_inside_pos > 0 ){
            scroll_delta_in = container_inside_pos - 1; // if scrolling outside and find trigger scroll inside 1px
            scroll_delta_out = trigger_middle_container - (0.5 * vh);

            toggle_scroll_inside();
            set_new_positions(scroll_delta_out, scroll_delta_in, true);
        }
        else{
            //update old_page_pos
            scope.old_page_pos = current_page_pos;
        }
    }
}