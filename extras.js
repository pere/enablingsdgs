function generate_select_csv(row) {

    //data from selected_card
    //row from table generation
    // class="rect_select"
    var html = '<div data_val="' + row.data + '" class="input-field"> <select class="rect_select"><option value="" disabled>Choose your option</option>';


    var colors_obj = structural_data.colors_obj;

    for (var p in colors_obj.data) {

        var t = colors_obj.data[p];

        if (parseInt(row.value) == parseInt(t.legend_val)) {
            html += '<option selected style="color:' + t.color + ';font-weight:bold;" value="' + t.legend_val + '">' + t.legend_text + '</option>';
        } else {
            html += '<option style="color:' + t.color + ';" value="' + t.legend_val + '">' + t.legend_text + '</option>';
        }
    }
    html += '</select></div>';
    //console.info(html)
    return html;



}



function attach_events_initial_dom() {

    console.log(options)

    // $('.sdg_cards_container').busyLoad("show", {
    //     spinner: "accordion",
    //     background: "#101010"
    // });
    $('#intro_modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .9, // Opacity of modal background
        inDuration: 500, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '14%', // Starting top style attribute
        endingTop: '30%', // Ending top style attribute
        ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            console.log(modal, trigger);

            // $('#intro_modal .btn.index_sat').trigger('click');

        },
        complete: function () { } // Callback for Modal close
    });


    $('#print_modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .9, // Opacity of modal background
        inDuration: 100, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '14%', // Starting top style attribute
        endingTop: '30%'
    });

    $('#intro_modal').modal('open');

    $('#intro_modal .modal-content').find('.btn').click(function () {

        if ($(this).hasClass('index')) {


            // window.location.replace('./sdgs_make_matrix_t3.html')
            options.config.from_csv = false;
            // $('.card-action:first a').trigger('click')
            // $('.sidenav_trigger').trigger('click');

            // $('.checkbox_all_goal:first').trigger('click')
            //options.config.from_csv=false; 
        } else {

            options.config.from_csv = true;
            $.ajax({
                url: './data/matrix.csv',
                dataType: 'text',
            }).done(successFunction);
        }


        $('#intro_modal').modal('close');



    });
    app.delete_card_info = function (clicked_card_data) {
        var target = $('.toast .delete_card_icon');
        var prev_card_val = parseInt(clicked_card_data.value);
        target.hide();
        $('.toast_slide_text').hide();
        console.info(clicked_card_data)

        // ?????????????
        clicked_card_data.with_data = false;
        // clicked_card_data.visualized=false;

        var filtered = d3v5.selectAll('.link').filter(function (d) {

            if (d.data == clicked_card_data.data) {
                return this;
            }
        });
        filtered.style("fill", function (d) {

            //we apply later, have to keep in memory the value to be removed
            //d.value=null;

            clicked_card_data = d;

            $('.:visible').css('color', function () {


                return "#c6c4c4";
            }).text(function () {
                return 'No value assigned';
            });

            var pos = unique_id_arr.ids.indexOf(d.data);


            for (var p in unique_id_arr) {
                unique_id_arr[p].splice(pos, 1);
            }
            console.log(clicked_card_data)

            //yLabels are HORIZONTAL. we have to count the SUM_COLS
            d3v5.selectAll(".yLabels_counter").filter(function (d) {
                console.info(d)
                if (d.id == clicked_card_data.to_id) {
                    d.sum_col = d.sum_col - (prev_card_val)
                    //d.sum_col=d.sum_col;
                    //d.col_number=col_number;
                    return this;
                }
                console.info(d)
            })
                .text(function (d) {
                    //if ()
                    return d.sum_col;
                });



            var x_sel_labels = d3v5.selectAll(".xLabels_counter").filter(function (d) {
                console.info(d)
                if (d.id == clicked_card_data.from_id) {
                    d.sum_rows = d.sum_rows - (prev_card_val)

                    return this;
                }
                console.info(d)
            })
                .text(function (d) {
                    //if ()
                    return d.sum_rows;
                })

            //to remove table
            // to update progressing tabs

            //WE ARE ON delete_card_info!
            $.when(app.tabulate_clicked(clicked_card_data, 'remove')).then(function (result) {

                d.value = null;
                d.comments = 'No comments';
                d.color = '#c6c4c4'
                $('.edit-icon').show();


                if (structural_data.colors_obj.total_records > 0) {
                    $('.goal_stats_container,.goal_table_container').fadeIn();
                } else {
                    $('.goal_stats_container,.goal_table_container').fadeOut();
                }


            })
            return "#c6c4c4";
        })
    } // END fx delete_card_info

    app.update_assoc_rect = function (params) {

        params.filtered.style("fill", function (d) {

            //we apply later, have to keep in memory the value to be removed
            //d.value=null;

            clicked_card_data = d;

            $('.card_val_title:visible').css('color', function () {

                return d.color;
            }).text(function () {
                return app.sel_color(d).legend_text;
            });

            return d.color;
        })


        console.log(dynamic_data.update_params)

        // params.prev_card_val = d.value;
        //             d.value = val;
        //             params.value = d.value;
        //             params.data = d;


        console.info(params)
        var clicked_card_data = params.data;

        params.filtered.style("opacity", 1);

        var all_vis_data = [];

        var sum_rows = 0;
        var row_number = 0;


        var row_filtered = d3v5.selectAll('.link').filter(function (d2) {

            if (d2.value !== null) {
                all_vis_data.push(d2)
            }
            if (d2.from_id == clicked_card_data.from_id && d2.value !== null) {
                row_number++;
                console.warn('summing ' + d2.value + ' for ' + d2.from_id)
                sum_rows += d2.value;
                return this;
            }

        });
        console.info(sum_rows)


        var x_sel_labels = d3v5.selectAll(".xLabels_counter").filter(function (d2) {

            if (d2.id == clicked_card_data.from_id) {
                d2.sum_rows = sum_rows;
                d2.row_number = row_number;
                return this;
            }
        });

        x_sel_labels.classed('with_data', true);

        x_sel_labels.text(sum_rows);
        var y_sel_labels = d3v5.selectAll(".yLabels_counter");


        var sum_col = 0;
        var col_number = 0;

        var col_filtered = d3v5.selectAll('.link').filter(function (d) {
            if (d.to_id == clicked_card_data.to_id && d.value !== null) {

                col_number++;
                sum_col += d.value;
                return this;
            }
        });

        var y_sel_labels = d3v5.selectAll(".yLabels_counter").filter(function (d) {
            if (d.id == clicked_card_data.to_id) {

                d.sum_col = sum_col;
                d.col_number = col_number;
                return this;
            }
        });

        y_sel_labels.classed('with_data', true);
        y_sel_labels.text(sum_col);

    } //end function update_assoc_rect

    $('body').on('click', function (e) {
        var target = $(e.target);

        if (target.is(':checkbox')) {
            if (target.parent().parent().attr('id') == 'dropdown_config_form') {
                var opt = target.attr('id');
                if (opt == 'opt_right') {
                    if (target.prop('checked'))
                        options.config.opt_right = true;
                    else
                        options.config.opt_right = false;
                }

                if (opt == 'opt_click') {
                    if (target.prop('checked'))
                        options.config.opt_click = true;
                    else
                        options.config.opt_click = false;
                }


                // opt_click
            }
        }

        // $('#dropdown_config_div').on('click',function(e)
        // {
        //   $('#dropdown_config_div')
        //   var target=$(e.target);
        //   console.log(target)
        // })
        if (target.hasClass('delete_card_icon')) {
            app.delete_card_info(clicked_card_data)

        }

        if (target.hasClass('toast_slide_color')) {
            if (target.hasClass('on')) {
                target.removeClass('on').addClass('off').text('Show score colors');
                $('.card_legend_tooltip_container').find('#legend_tooltip').hide();


            } else {
                target.removeClass('off').addClass('on').text('Hide score colors');
                $('.card_legend_tooltip_container').find('#legend_tooltip').show();
            }
        }

        if (target.hasClass('toast_slide_text')) {
            if (target.hasClass('on')) {
                target.toggleClass('on').text('Show text form');
                $('.card_legend_tooltip_container').find('#legend_tooltip').hide();
                // $('.card_text_form').show();


            } else {
                target.addClass('on').text('Hide text form');
                //  $('.card_text_form').hide();


                $('.card_legend_tooltip_container').find('#legend_tooltip').show();


            }
        }

        if (target.hasClass('edit-icon')) {
            //  $('.toast_slide_text').show();
            console.info(clicked_card_data)
            if (!$('.card_legend_tooltip_container').is(':visible')) {
                $('.card_legend_tooltip_container').fadeIn();
                $('i.edit-icon').hide();
                //$('i.delete_card_icon').removeClass('right');
            }
            return false;
        }
        if (target.hasClass('close_tooltip')) {
            var filtered = d3v5.selectAll('.g_matrix rect').filter(function (d) {
                return d.data == clicked_card_data.data

            })

            if ($('.card_toast.blues').length > 0) {
                $('.card_toast.blues').fadeOut()
                $('.card_toast.blues').remove();

                d3v5.selectAll('.g_matrix rect').classed('bordered', true);
                filtered.classed('clicked_card_class', false)



                filtered
                    .transition().duration(550)
                    .style(

                        'fill',
                        function (d) {
                            return d.color
                        }
                    );

            }

            $('.editing_card_toast').remove()

            clicked_card = false;
            clicked_card_data = null;
        } else {
            //rectangles on the LEGEND
            if (target.is('rect') && target.parent().hasClass('legend')) {
                var val = parseInt(target.attr('value'));
                var filtered = d3v5.selectAll('.link').filter(function (d) {

                    if (d.data == clicked_card_data.data) {
                        return this;
                    }

                })

                console.info(filtered)
                //select_triggered = true;
                var prev_card_val;

                dynamic_data.update_params.filtered = filtered;

                var params = dynamic_data.update_params;
                //var params = { data: null, new: true, prev_card_val: null, value: null, filtered: filtered }

                //FILL WHEN WE CLICK ON THE RECTS
                filtered.style("fill", function (d) {

                    $('#right_container').show();
                    params.prev_card_val = d.value;
                    d.value = val;
                    d.color = app.sel_color(d).color;

                    params.value = d.value;
                    params.data = d;

                    clicked_card_data = d;

                    var goal = d.goal;

                    //removeClass('right').

                    $('i.delete_card_icon').show();

                    $('i.edit-icon').hide();

                    $('.card_text_form').show();


                    var pos = app_data.entered_data.ids.indexOf(d.data);

                    if (pos == -1) {
                        params.new = true;
                        // console.log('first time for this value')
                        // app_data.entered_data.ids.push(d.data)
                        // app_data.entered_data.values.push(d.value);
                        //tabulate_clicked already include update_progress_bar
                        app.tabulate_clicked(d, 'add');

                        //app.update_progress_bars('add', d);


                        //app.check_update(val, prev_card_val, clicked_card_data, d, goal);

                        //console.info('rect first enter from table to ' + app.sel_color(d).color)
                    } else {
                        params.new = false;
                        app.update_progress_bars('update', d, params);

                    }
                    //here we trigger a click on the select!
                    app.do_updates_on_select(d, params);
                    console.warn(dynamic_data.from_ids_counts)

                });
                console.log('pre val is ' + params.prev_card_val)

                console.log(dynamic_data.update_params)

                //update labels counters
                app.update_assoc_rect(params)

            } else {
                // return false;
            }
        }

    })
}

function tabulate_from_csv() {

    $('#right_container').show();
    $('.goal_stats_container,.goal_table_container').show();
    // var columns = ['From', 'to', 'value'];
    var columns = ['Data', 'value'];

    var present_in_csv_goals = goal_stats.map(function (d) {
        console.warn('to fix')
        //$('.side-nav .input-field select').eq(d.goal-1).trigger('click')
        return d.goal;
    });

    $('.right_container_cards .ul_tables .collapsible-body.white > ul').empty();

    $('.satellite_options select').empty()

    var satellites_sel_html = '<option value="empty" disabled selected>Select target</option>';
    for (var p in objects) {
        var sdg_obj = objects[p];
        satellites_sel_html += '<option value="' + sdg_obj.from_id + '">Target ' + sdg_obj.from_id + '</option>';

    }
    console.log(satellites_sel_html)
    $('.ul_satellite').show();

    $('.satellite_options select').append(satellites_sel_html);


    setTimeout(function () {

        $('.satellite_options select').material_select();

        // $('.satellite_options select').bind('change', function (e) {
        //     alert('sateelite')
        //     var data_id = $(this).find('option:selected')[0].value;
        //     console.warn(data_id)

        //     if (data_id == 'empty') return false;

        //     var _type = $('#satellite_selects_opt form input:checked').attr('id')
        //     create_satellite(data_id, _type, e);

        // })

        // //RADIO BUTTONS
        // $('#satellite_selects_opt form').change(function (e) {
        //     var data_id = $('.satellite_options select').find('option:selected')[0].value;
        //     if (data_id !== 'empty') {



        //         var _type = $(this).find('input:checked').attr('id');

        //         // if (data_id=='empty') return false;

        //         create_satellite(data_id, _type, e);

        //     }

        // })
    }, 1000)

    var goals_keys = d3v5.map(new_params.objects, function (d) {
        return d.goal;
    }).keys()

    new_params.objects.forEach(function (obj_d, i_obj) {
        var t_goal = obj_d.goal;
        var pos = goals_keys.indexOf(obj_d.goal);
        var this_from_id = obj_d.from_id.replace('.', '_');
        //  var this_from_id = obj_d.from_id;
        console.log(this_from_id)

        // if (this_from_id==)
        if (pos !== -1) {



            var right_container_cards_html = '<li class="li_goal_container class_' + t_goal + '"><div class="collapsible-header nav_bar_' + t_goal + '"><div class="card horizontal"><div class="card-image"> <img class="responsive-img" style="width:70px" src="./img/sdg' + t_goal + '.png"></div><div class="card-stacked"><div class="card-content"><div class="card-sdg-goal card-goal-' + t_goal + '"> Goal ' + t_goal + '</div><span class="card_count"></span></div></div></div></div><div class="collapsible-body"><ul>';

            var to_target_li = '<li class="li_' + this_from_id + '"><table class="active responsive-table striped highlight sel_table_goal target_' + this_from_id + '"><thead><tr class="row"><td width:"80%">Target ' + obj_d.from_id + '</td></tr></thead><tbody></tbody></table></li></ul> </div></li>';
            //console.log('<li class="li_' + this_from_id + '"><table class="responsive-table striped highlight sel_table_goal target_' + this_from_id + '"><thead><tr class="row"><div>Target ' + obj_d.from_id + '</div></tr></thead><tbody></tbody></table></li></ul> </div></li>')

            $('#right_container > div.right_container_cards > ul.collapsible.ul_tables > li > div.collapsible-body.white > ul')
                // $('.right_container_cards ul.collapsible.ul_tables > li > div.collapsible-body.white')
                .append(right_container_cards_html + to_target_li);
            goals_keys.splice(pos, 1);

            $('.right_container_cards .ul_tables .li_goal_container.class_' + t_goal).show();
        } else {
            console.warn('present ' + obj_d.goal)
            var to_target_li = '<li class="li_' + this_from_id + '"><table class="active responsive-table striped highlight sel_table_goal target_' + this_from_id + '"><thead><tr class="row"><td width:"80%">Target ' + obj_d.from_id + '</td></tr></thead><tbody><span style="height:83px"></span></tbody></table></li></ul> </div></li>';

            //   $('#right_container > div.right_container_cards > ul.collapsible.ul_tables > li > div.collapsible-body.white > ul')
            $('.right_container_cards .ul_tables .li_goal_container.class_' + t_goal + ' .collapsible-body ul')
                // $('.right_container_cards ul.collapsible.ul_tables > li > div.collapsible-body.white')
                .append(to_target_li);
        }

        var table = d3v5.select($('.li_goal_container.class_' + t_goal + ' > div.collapsible-body > ul >  li.li_' + this_from_id + ' table')[0]);

        var thead = table.select('thead');
        var tbody = table.select('tbody');

        var row_data = obj_d.values.filter(function (d2, i) {

            d2.from_id = d2.data.split('-')[0];

            if (d2.from_id !== d2.to_id) {


                //    console.info(d.data)
                //console.warn(d2)
                return d2;
            } else {
                console.info(d2)
                return false;
            }


        })

        var rows = tbody.selectAll('tr').data(row_data, function (d) {
            return d.data;
        })
            .enter()
            .append('tr');



        rows.attr('data_val', function (d) {

            return d.data
        });

        $('.li_goal_container.class_' + t_goal + ' li.li_' + this_from_id + ' table tbody').prepend('<tr class="extra_tr" height="50px"></tr>');



        table.on('mouseover', function (d) {
            //console.info(d3v5.event.target)

            //this refers to TR
            //console.log(this)
            if ($(d3v5.event.target).hasClass('sel_table_value')) {
                $(d3v5.event.target).addClass('active');
                /* console.log(d)
                 console.warn('mouseovering TR')*/
                var cards = d3v5.selectAll('.link')
                cards.transition().duration(350).style('opacity', 0.1);
                console.info($(d3v5.event.target).parents().closest('tr'))
                var _data = $(d3v5.event.target).parents().closest('tr')[0]['__data__'];

                var sel = cards.filter(function (data) {

                    return data.data == _data.data;
                });


                sel.transition().duration(450).style('opacity', 1)

                sel.classed('hovered_class_from_table', true);
            } else {
                if ($(this).find('.sel_table_value.active')) {
                    $(this).find('.sel_table_value').removeClass('active');
                    var cards = d3v5.selectAll('.link');

                    var sel = cards.filter(function (data) {
                        return data.visualized == true;
                    });
                    sel.transition().duration(50).style('opacity', 1)
                    d3v5.selectAll('.hovered_class_from_table').classed('hovered_class_from_table', false);
                }
            }

        })

            .on('mouseout', function (d) {
                // console.warn($(d3v5.event.target))
                if ($(d3v5.event.target).hasClass('sel_table_value')) {

                    var cards = d3v5.selectAll('.link')

                    cards.style('opacity', function (card) {
                        if (card.visualized == true) {
                            return 1;
                        } else {
                            return 0.2;
                        }
                    })
                    //   console.warn('mouseout from table row')
                    var filtered = d3v5.selectAll('.hovered_class_from_table');
                }


            })

        //acting over new_params.objects as DATA
        var cells = rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    // console.info(columns)

                    if (column == 'Data') // || column=='to')
                    {
                        //return {column: column, value: row['from_title']};
                        return {
                            column: column,
                            comments: row.comments,
                            value: 'Target ' + row['from_id'] + ' to ' + row['to_id']
                        };
                    }
                    if (column == 'value') {

                        var goal = row['from_id'].split('.')[0];
                        return {
                            column: 'value',
                            goal: goal,
                            data: row.data,

                            value: row['value'],
                            comments: row['comments']
                        };

                    }

                    if (column == 'comments') {
                        return {
                            column: 'comments',
                            comments: row.comments
                        }
                    }


                    //  return {column: row.id, value: row.description};
                });
            })
            .enter()
            .append('td')
            .style('background-color', function (d) {

                return 'white';

            })

            .html(function (d) {

                //+generate_select(d,data)
                var a = [];
                // if (d.from_id === d.to_id)
                //     return false;

                if (d.column == 'value') {
                    var p = app.sel_color(d);

                    //<a class="btn tooltipped" data-position="bottom" data-html="true">Hover me!</a>
                    var color = p.color;
                    var text = p.legend_text;
                    var val = p.legend_val;

                    var html = '<h5 style="background-color:' + color + '" data_val="' + val + '" class="sel_table_value">' + text + '</h5>' + generate_select_csv(d);

                    return html;

                }
                if (d.column == 'Data') {

                    var html = '<div>' + d.value + '</div>';
                    html += '<div class="comments"><small>' + d.comments + '</small></div>';
                    return html;
                }
                // if (d.column == 'comments') {
                //     console.log('some coment')
                //     var html = '<div>TEST' + d.comments + '</div>';
                //     return html;
                // }


            });
    })
    //     } //end if present on goals arr
    // })

    $('.sel_table_goal.responsive-table thead').click(function (e) {
        if ($(e.target).parents().closest('svg').length == 0) {
            console.info('not svg')
            var container = $(this).parent();
            if (container.hasClass('active')) {
                container.find('tbody tr').not('.extra_tr').hide();
                container.find('tbody tr.extra_tr').attr('style', '');
                container.find('tbody tr.extra_tr').css('position', 'relative!important');
                container.removeClass('active')
            } else {
                container.find('tbody tr').not('.extra_tr').show();
                container.find('tbody tr.extra_tr').css('position', 'absolute!important');
                container.addClass('active')
            }

        }
    })
}

//executed when we click on a Goal X header
function attach_fx_sel_csv(container) {

    console.info('attach_fx_sel_csv for this goal tables')

    container.find('table tbody tr').not('.extra_tr').each(function () {


        var container_tr = $(this);

        var _id = container_tr.attr('data_val');

        var data = new_params.heatmap_data.links.filter(function (d) {
            return d.data == _id;
        })[0];


        var mat_sel = container_tr.find('select'); //.not('.initialized');

        var prev_sel_val = parseInt(mat_sel.find('option:selected')[0].value);

        mat_sel.material_select();

        for (var p in dynamic_data.from_ids_counts) {
            if (dynamic_data.from_ids_counts[p].id == data.from_id)
                app.circles_stats(dynamic_data.from_ids_counts[p])
        }

    })


}

function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    console.log(allRows[0])

    var all_to_ids = [];
    var all_to_ids_obj = [];
    app_data.entered_data = { ids: [], values: [] }
    console.info(allRows.length) //21
    allRows.forEach(function (d, i) {

        var this_row_cells = d.split(',');
        var l = this_row_cells.length;


        if (i == 0) {
            //for each cell on the FIRST ROW (to_id), create an obj taht will store the data 
            this_row_cells.forEach(function (d2, i2) {

                var this_obj = {
                    from_id: d2,
                    goal: d2.split('.')[0],
                    sum_rows: 0,
                    sum_cols: 0,
                    values: []
                }

                all_to_ids.push(d2);
                all_to_ids_obj.push({
                    to_id: d2,
                    sum_cols: 0
                });

                objects.push(this_obj)
            })

        } else {
            //  console.info(all_to_ids)
            if (typeof objects[i - 1] !== undefined)
                //each data on the ROW, is a value
                //{from_id:'1.1',sum_rows:3,values:[{},{}]}
                var s;
            this_row_cells.forEach(function (d2, i2) {

                //the FIRST cell is the from_id
                if (i2 == 0) {
                    var o = objects[i - 1];

                    objects[i - 1].from_id = d2;
                    //o.data=d2+'-'+o.to_id;

                    // objects[i-1].values.push({val:d2,to_id:all_to_ids[i2]});                            
                } else {
                    //reference to the previously created object
                    var o = objects[i - 1];

                    o.sum_rows += parseInt(d2);

                    //because the first 
                    var to_id = all_to_ids[i2 - 1];
                    var pos = all_to_ids.indexOf(to_id);

                    //all_to_ids_obj[pos].sum_col+=parseInt(d2);
                    all_to_ids_obj[pos].sum_cols = all_to_ids_obj[pos].sum_cols + parseInt(d2)
                    //   console.warn(all_to_ids_obj[pos])
                    s = all_to_ids_obj[pos].sum_cols;
                    app_data.entered_data.ids.push(o.from_id + '-' + all_to_ids[i2 - 1]);
                    app_data.entered_data.values.push(parseInt(d2))

                    o.values.push({
                        data: o.from_id + '-' + all_to_ids[i2 - 1],
                        from_id: o.from_id,
                        to_id: to_id,
                        value: parseInt(d2),
                        color: app.sel_color({
                            value: parseInt(d2)
                        }).color,
                        comments: 'No comments'

                    });
                    //    console.log(o)                                     

                }
            })

        }

        // objects.push(this_obj)
    })
    //console.log(objects)

    for (var p in objects) {
        var obj = objects[p];

        for (var p2 in all_to_ids_obj) {
            var d = all_to_ids_obj[p2];
            if (d.to_id == obj.from_id) {
                obj.sum_cols = d.sum_cols;
            }
        }
        Array.prototype.push.apply(all_t_val, objects[p].values);
    }


    console.warn(all_t_val)
    console.info(objects)
    new_params.objects = objects;
    dynamic_data.selected_goals_arr = d3v5.map(objects, function (d) {
        return d.from_id.split('-')[0].split('.')[0]
    }).keys();
    dynamic_data.pushed_vis_targets = d3v5.map(objects, function (d) {
        return d.from_id

    }).keys()
    console.info(dynamic_data)

    dynamic_data.selected_goals_arr.forEach(function (d, i) {
        $('.side-nav .input-field select option[value="' + d + '"]').prop('selected', true);
        $('.card-goal-' + d).parent().find('.card-action a').trigger('click');
        $('.side-nav .li_goal_container.' + d + ' .collapsible-header').trigger('click');

    })
    $('.side-nav .input-field select').material_select('from_outside')
    app.attach_ev_sidenav_select();
    console.info(dynamic_data.pushed_vis_targets)
    $('.li_goal_container:visible').each(function () {
        var checkboxes = $(this).find(':checkbox').not('.checkbox_all_goal');

        checkboxes.each(function (i, _this) {
            // var _this = checkboxes[p];

            $(_this).prop('checked', false);
            //id check_2.3
            var _t_target = $(_this).attr('id').split('_')[1];

            if (dynamic_data.pushed_vis_targets.indexOf(_t_target) !== -1)
                $(_this).prop('checked', true);
        })

    })
    //$('.side-nav .input-field select').trigger('change');

    console.info(all_t_val)

    dynamic_data.from_ids_counts = objects.map(function (d, i) {

        return {
            goal: d.goal,
            id: d.from_id,
            from_id: d.from_id,
            sum_rows: d.sum_rows,
            sum_cols: d.sum_cols,
            value_stats: null
        };
    });

    console.warn(dynamic_data.from_ids_counts)

    var val_range = [-3, -2, -1, 0, 1, 2, 3];

    for (var p in objects) {


        var _this = objects[p];

        var range_obj = val_range.map(function (d) {
            return { value: d, sum: 0 }
        });

        // _this contains from_id, sum_cols... and array of values
        var from_id = _this.from_id;

        for (var i = 0; i < _this.values.length; i++) {

            if (_this.values[i].from_id !== _this.values[i].to_id) {

                var val = _this.values[i].value;

                var pos = val_range.indexOf(val);
                range_obj[pos].sum++;
            } else {

            }

            //_this.values_stats[pos].sum+=val;

        }
        _this.values_stats = range_obj;
        dynamic_data.from_ids_counts.filter(function (d) {
            if (d.id == from_id)
                d.value_stats = range_obj
        })



    }



    console.log(dynamic_data.from_ids_counts)

    //it calls get_targets
    get_individual_target();


    tabulate_from_csv();

    // setTimeout(function() {
    //     console.log(dynamic_data)
    //     for (var p in dynamic_data.from_ids_counts) {
    //         app.circles_stats(dynamic_data.from_ids_counts[p])
    //     }

    // }, 2500)

    //$('.li_goal_container')
    $('.ul_tables .goal_table_container').unbind('click');
    $('.ul_tables .goal_table_container').each(function () {
        attach_fx_sel_csv($(this).find('.collapsible-header').next())
    })


    $('.ul_tables .goal_table_container').bind('click', function (e) {


        if ($(e.target).hasClass('card-content') || $(e.target).hasClass('card-sdg-goal') || $(e.target).hasClass('collapsible-header')) {
            console.log($(e.target))

            if ($(e.target).hasClass('collapsible-header') == false)
                var header = $(e.target).parents().closest('.collapsible-header');
            else
                var header = $(e.target);

            var container = header.next() //find('.collapsible-body');
            console.warn(container)

            if (container.is(':visible')) {
                container.hide();
            } else {

                //  if (container.find('select.initialized').length == 0)

                container.show();


            }
        }
    })



    $('.ul_satellite .collapsible-header').click(function (e) {
        e.preventDefault();
        var body = $('.ul_satellite').find('.collapsible-body');
        if (body.is(':visible')) {
            console.log('hide')
            body.hide();
            return false;

        } else {
            console.log('show')
            body.show();
            return false;
        }
        //.li_goal_container

    })
    options.config.from_csv = false;
}

//["all_goal_1", "1.3", "1.4", "1.5", "1.a", "1.b"]
function get_individual_target(goal, target_id) {
    console.info(arguments)
    console.log(all_t_val)
    $('#sdg_cards_container .row:first,.sdg_container h5:first').hide();
    $('#sdg_cards_container .row').eq(1).show();
    //we add info on cache for all targets of the goal
    sel_info = app.get_targets(false);
    var plot_labels = sel_info['targets'];

    var hidden_links = [];
    var only_data_links = [];

    //contain undefined values!
    console.log(sel_info['links']);
    var plot_links = [];

    //we assign each value to its corresponding sel_info.link

    if (options.config.from_csv == true) {
        console.log(new_params)
        //contains VALUES! created on charging the CSV
        var obj = new_params['objects'];

        //we store all values OBJECTS in an array
        var obj_all = [];

        for (var i = 0; i < obj.length; i++) {
            var values = obj[i].values;

            for (var y = 0; y < values.length; y++) {

                obj_all.push(values[y])
            }
        }

        var keys = d3v5.map(obj_all, function (d) {
            return d.data;
        }).keys();



        app_data.entered_data.ids = keys;
        //from_csv is TRUE
        for (var x in sel_info['links']) {

            var pt = sel_info['links'][x];
            var pos = keys.indexOf(pt.data)

            //  console.log(pt)
            if (pos !== -1) {
                var obj = obj_all[pos];
                pt.visualized = true;
                pt.value = obj.value;
                pt.color + obj.color;

                //  app_data.entered_data.values.push(obj.value);

                only_data_links.push(pt);
                plot_links.push(pt);
            }

        }
    } else {
        //get_individual_target
        //from_csv is FALSE
        var keys = d3v5.map(sel_info['links'], function (d) {
            //  console.log(d)

            //IF WE START FROM ZERO or NO DATA HAS BEEN INSERTED?? then value==null
            //https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript

            //if (d.value!==null)
            return d.data;
        }).keys();
        console.log(app_data.entered_data.values)

        for (var x in sel_info['links']) {

            //we should check if we have some data stored...
            var pt = sel_info['links'][x];


            var pos = app_data.entered_data.ids.indexOf(pt.data);


            if (pos == -1) {
                //var obj=obj_all[pos];
                pt.visualized = true;
                pt.value = null
                pt.color = '#c6c4c4';

            } else {
                pt.visualized = true;
                pt.value = app_data.entered_data.values[pos];
                pt.color = app.sel_color({ value: app_data.entered_data.values[pos] }).color;
            }

            only_data_links.push(pt);
            plot_links.push(pt);

        }
    }

    app_data.to_plot_heatmap = [];
    for (var p in plot_links) {
        app_data.to_plot_heatmap.push(plot_links[p])
    }

    //only_data_links:only_data_links,                   
    var to_plot = {
        links: plot_links,
        targets: plot_labels,
        hidden_links: hidden_links
    }
    console.log(to_plot)

    //   debugger;

    if ($("#chart svg").length > 0) {

        // $("#chart svg:first").remove();
        // create_chart()
        app.heatmap(to_plot, true);

    } else {
        app.create_chart();
        app.heatmap(to_plot, true);
        app.create_legend();

        //creating tables
        $('#sdg_cards_container .row').eq(1).hide();

        setTimeout(function () {
            $('#sdg_cards_container .row').eq(1).show();
        }, 800)
    }
}
