var category = {
    elem: '',
    data: [],
    renderTitle: function(isEmpty, text, code) {
        var _that = this;
        var $text = _that.elem.find('.category-text');
        !isEmpty ? $text.text(text).attr('data-code', code) : $text.text('请选择').attr('data-code', '')
    },
    renderHtml: function() {
        var _that = this;
        var $elem = _that.elem;
        var $select = $elem.find('.category-select');
        var data = _that.data;
        var defaultCode = _that.defaultCode;
        if (data.length) {
            var category1 = '<ul class="category-item category-item1">';
            var category2 = '<ul class="category-item category-item2">';
            $.each(data, function(i, item1) {
                category1 += '<li class="' + (item1.CategoryNo == defaultCode ? "active" : "") + '" title="' + item1.CategoryName + '" code="' + item1.CategoryNo + '">' + item1.CategoryName + '</li>';
                if (item1.Children.length) {
                    $.each(item1.Children, function(n, item2) {
                        category2 += '<li class="' + (item2.CategoryNo == defaultCode ? "active" : "") + '" title="' + item2.CategoryName + '" code="' + item2.CategoryNo + '" parent-code="' + item2.ParentCategoryNo + '">' + item2.CategoryName + '</li>';
                    });
                }
            });
            category1 += '</ul>';
            category2 += '</ul>';
            $select.html(category1 + category2);
            // 重设category-item宽度
            $select.find('.category-item').css('width', ($select.outerWidth() / 2) - 1);
            // 初始化默认值和状态
            var text = '';
            var $secondActive = $elem.find('.category-item2 .active');
            if ($secondActive.length) {
                var $parentLi = $elem.find('[code="' + $secondActive.attr('parent-code') + '"]');
                $parentLi.addClass('active').siblings().removeClass('active');
                text = $parentLi.text() + ' / ' + $secondActive.text();
            } else {
                text = _that.elem.find('.active').text();
            }
            text ? _that.renderTitle(0, text, defaultCode) : _that.renderTitle(1)
        }
    },
    bindEvent: function() {
        var _that = this;
        var $elem = _that.elem;
        var isDisabled = $elem.hasClass('category-dropdown-disabled');
        // 显示下拉框
        if (!isDisabled) {
            $elem.on('click', '.category-title', function(e) {
                var $title = $(this);
                var $parent = $title.parent();
                var $select = $parent.find('.category-select').show();
                $elem.find('.category-item2').hide();
            });
        }
        // 显示对应分类
        $elem.on('mouseenter', '.category-item1 li', function(e) {
            var $me = $(this);
            var code = $me.attr('code');
            var $category2 = $me.parent().siblings('.category-item2');
            $category2.show().find('li').hide();
            $category2.find('[parent-code=' + code + ']').show();
        });
        // 选中
        $elem.on('click', '.category-select li', function(e) {
            var $me = $(this);
            var code = $me.attr('code');
            var text = '';
            if ($me.parent().hasClass('category-item2')) {
                var $parentLi = $elem.find('[code="' + $me.attr('parent-code') + '"]');
                $parentLi.addClass('active').siblings().removeClass('active');
                text += $parentLi.text() + ' / '
            } else {
                $elem.find('.category-item2 li').removeClass('active');
            }
            $me.addClass('active').siblings().removeClass('active');
            text += $me.text();
            $elem.find('.category-text').text(text).attr('data-code', $me.attr('code'));
            $elem.find('.category-select').hide();

        });
        //滑到层外区域隐藏层
        $elem.on('mouseleave', '.category-select', function(e) {
            $(this).hide();
        });
        //点击层外区域隐藏层
        $("html,body").click(function(i) {
            var isParent = $(i.target).parents(".category-dropdown").length;
            if (!isParent) {
                $('.category-dropdown .category-select').hide();
            }
        });
    },
    // data返回数据(必须),selector绑定元素选择器(必须),defaultCode初始默认值(不设默认为数据第一级第一个)
    // 禁用方式：data判断条件下为空 或 给selector元素加category-dropdown-disabled类名
    init: function(data, selector, defaultCode) {
        var _that = this;
        var elem = $(selector);
        if (elem.length) {
            _that.elem = elem;
            if (data && data.length) {
                _that.data = data;
                _that.defaultCode = defaultCode ? defaultCode + '' : data[0].CategoryNo;
                _that.renderHtml(data);
                _that.bindEvent();
            } else {
                _that.renderTitle(1);
                console.log('param "data" is not available!');
                return false;
            }
        } else {
            console.log('jQ element "$(' + selector + ')" is not available!')
            return false;
        }
    }
}
