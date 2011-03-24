//shake effects !!
Ext.apply(Ext.Fx, {
    shake: function (o) {
        o = Ext.applyIf(o || {}, {
            shakes: 5,
            excitement: 1,
            direction: 'x'
        });
        var me = this,
			dom = me.dom,
			c = o.direction.toUpperCase(),
			a = Ext.fly(dom).getStyle("position") == 'absolute',
			pos = a ? Ext.fly(dom)['get' + c]() : 0,
			attr = (c == 'X') ? 'left' : 'top',
			s = o.shakes,
			r = s * 2,
			e = o.excitement * 2,
			sp = Ext.fly(dom).getPositioning(),
			animArg = {},
			t;
        t = animArg[attr] = {
            to: 0
        };

        if (!a) {
            me.position();
        }
        function animFn() {
            t.to = (r & 1) ? pos - (s-- * e) : pos + (s * e);
            arguments.callee.anim = Ext.fly(dom).fxanim(animArg, o, 'motion', 0.1, 'easeNone', function () {
                if (--r > 0) {
                    me.queueFx({
                        concurrent: true
                    }, animFn);
                } else {
                    Ext.fly(dom).setPositioning(sp).afterFx(o);
                }
            });
        }

        me.queueFx({
            concurrent: true
        }, animFn);
        return me;
    }
});

Ext.Element.addMethods(Ext.Fx);