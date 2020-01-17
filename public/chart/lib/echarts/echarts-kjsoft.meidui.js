//水球图
;(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['echarts'], factory) :
	(factory(global.echarts));
}(this,(function (echarts) { 
	'use strict';
	var seriesType = "meidui";
	var completeDimensions = echarts.helper.completeDimensions;
	
	var numberUtil = echarts.number;
	var symbolUtil = {
	    createSymbol:echarts.helper.createSymbol
	}
	var parsePercent = numberUtil.parsePercent;
	
	echarts.extendSeriesModel({

	    type: 'series.meidui',

	    dependencies: ['grid'],

	    brushSelector: 'rect',

	    /**
	     * @override
	     */
	    getProgressive: function () {
	        // Do not support progressive in normal mode.
	        return this.get('large')
	            ? this.get('progressive')
	            : false;
	    },

	    /**
	     * @override
	     */
	    getProgressiveThreshold: function () {
	        // Do not support progressive in normal mode.
	        var progressiveThreshold = this.get('progressiveThreshold');
	        var largeThreshold = this.get('largeThreshold');
	        if (largeThreshold > progressiveThreshold) {
	            progressiveThreshold = largeThreshold;
	        }
	        return progressiveThreshold;
	    }
	});
	
	var MeiDuiLayout = echarts.graphic.extendShape({
	    type: 'ec-kj-meidui',

	    shape: {
	        waveLength: 0,
	        radius: 0,
	        cx: 0,
	        cy: 0,
	        waterLevel: 0,
	        amplitude: 0,
	        phase: 0,
	        inverse: false
	    },

	    buildPath: function (ctx, shape) {
	        /**
	         * We define a sine wave having 4 waves, and make sure at least 8 curves
	         * is drawn. Otherwise, it may cause blank area for some waves when
	         * wave length is large enough.
	         */
	        var curves = Math.max(
	            Math.ceil(2 * shape.radius / shape.waveLength * 4) * 2,
	            8
	        );

	        // map phase to [-Math.PI * 2, 0]
	        while (shape.phase < -Math.PI * 2) {
	            shape.phase += Math.PI * 2;
	        }
	        while (shape.phase > 0) {
	            shape.phase -= Math.PI * 2;
	        }
	        var phase = shape.phase / Math.PI / 2 * shape.waveLength;

	        var left = shape.cx - shape.radius + phase - shape.radius * 2;

	        /**
	         * top-left corner as start point
	         *
	         * draws this point
	         *  |
	         * \|/
	         *  ~~~~~~~~
	         *  |      |
	         *  +------+
	         */
	        ctx.moveTo(left, shape.waterLevel);

	        /**
	         * top wave
	         *
	         * ~~~~~~~~ <- draws this sine wave
	         * |      |
	         * +------+
	         */
	        var waveRight = 0;
	        for (var c = 0; c < curves; ++c) {
	            var stage = c % 4;
	            var pos = getWaterPositions(c * shape.waveLength / 4, stage,
	                shape.waveLength, shape.amplitude);
	            ctx.bezierCurveTo(pos[0][0] + left, -pos[0][1] + shape.waterLevel,
	                pos[1][0] + left, -pos[1][1] + shape.waterLevel,
	                pos[2][0] + left, -pos[2][1] + shape.waterLevel);

	            if (c === curves - 1) {
	                waveRight = pos[2][0];
	            }
	        }

	        if (shape.inverse) {
	            /**
	             * top-right corner
	             *                  2. draws this line
	             *                          |
	             *                       +------+
	             * 3. draws this line -> |      | <- 1. draws this line
	             *                       ~~~~~~~~
	             */
	            ctx.lineTo(waveRight + left, shape.cy - shape.radius);
	            ctx.lineTo(left, shape.cy - shape.radius);
	            ctx.lineTo(left, shape.waterLevel);
	        }
	        else {
	            /**
	             * top-right corner
	             *
	             *                       ~~~~~~~~
	             * 3. draws this line -> |      | <- 1. draws this line
	             *                       +------+
	             *                          ^
	             *                          |
	             *                  2. draws this line
	             */
	            ctx.lineTo(waveRight + left, shape.cy + shape.radius);
	            ctx.lineTo(left, shape.cy + shape.radius);
	            ctx.lineTo(left, shape.waterLevel);
	        }

	        ctx.closePath();
	    }
	});
	
	function getShallow(model, path) {
	    return model && model.getShallow(path);
	}

	
	extendChartView({

	    type: seriesType,

	    render: function (seriesModel, ecModel, api) {
	        this._updateDrawMode(seriesModel);

	        var coordinateSystemType = seriesModel.get('coordinateSystem');

	        if (coordinateSystemType === 'cartesian2d'
	            || coordinateSystemType === 'polar'
	        ) {
	            this._isLargeDraw
	                ? this._renderLarge(seriesModel, ecModel, api)
	                : this._renderNormal(seriesModel, ecModel, api);
	        }
	        else if (__DEV__) {
	            console.warn('Only cartesian2d and polar supported for bar.');
	        }

	        return this.group;
	    },

	    incrementalPrepareRender: function (seriesModel, ecModel, api) {
	        this._clear();
	        this._updateDrawMode(seriesModel);
	    },

	    incrementalRender: function (params, seriesModel, ecModel, api) {
	        // Do not support progressive in normal mode.
	        this._incrementalRenderLarge(params, seriesModel);
	    },

	    _updateDrawMode: function (seriesModel) {
	        var isLargeDraw = seriesModel.pipelineContext.large;
	        if (this._isLargeDraw == null || isLargeDraw ^ this._isLargeDraw) {
	            this._isLargeDraw = isLargeDraw;
	            this._clear();
	        }
	    },

	    _renderNormal: function (seriesModel, ecModel, api) {
	        var group = this.group;
	        var data = seriesModel.getData();
	        var oldData = this._data;

	        var coord = seriesModel.coordinateSystem;
	        var baseAxis = coord.getBaseAxis();
	        var isHorizontalOrRadial;

	        if (coord.type === 'cartesian2d') {
	            isHorizontalOrRadial = baseAxis.isHorizontal();
	        }
	        else if (coord.type === 'polar') {
	            isHorizontalOrRadial = baseAxis.dim === 'angle';
	        }

	        var animationModel = seriesModel.isAnimationEnabled() ? seriesModel : null;

	        data.diff(oldData)
	            .add(function (dataIndex) {
	                if (!data.hasValue(dataIndex)) {
	                    return;
	                }

	                var itemModel = data.getItemModel(dataIndex);
	                var layout = getLayout[coord.type](data, dataIndex, itemModel);
	                var el = elementCreator[coord.type](
	                    data, dataIndex, itemModel, layout, isHorizontalOrRadial, animationModel
	                );
	                data.setItemGraphicEl(dataIndex, el);
	                group.add(el);

	                updateStyle(
	                    el, data, dataIndex, itemModel, layout,
	                    seriesModel, isHorizontalOrRadial, coord.type === 'polar'
	                );
	            })
	            .update(function (newIndex, oldIndex) {
	                var el = oldData.getItemGraphicEl(oldIndex);

	                if (!data.hasValue(newIndex)) {
	                    group.remove(el);
	                    return;
	                }

	                var itemModel = data.getItemModel(newIndex);
	                var layout = getLayout[coord.type](data, newIndex, itemModel);

	                if (el) {
	                    updateProps(el, {shape: layout}, animationModel, newIndex);
	                }
	                else {
	                    el = elementCreator[coord.type](
	                        data, newIndex, itemModel, layout, isHorizontalOrRadial, animationModel, true
	                    );
	                }

	                data.setItemGraphicEl(newIndex, el);
	                // Add back
	                group.add(el);

	                updateStyle(
	                    el, data, newIndex, itemModel, layout,
	                    seriesModel, isHorizontalOrRadial, coord.type === 'polar'
	                );
	            })
	            .remove(function (dataIndex) {
	                var el = oldData.getItemGraphicEl(dataIndex);
	                if (coord.type === 'cartesian2d') {
	                    el && removeRect(dataIndex, animationModel, el);
	                }
	                else {
	                    el && removeSector(dataIndex, animationModel, el);
	                }
	            })
	            .execute();

	        this._data = data;
	    },

	    _renderLarge: function (seriesModel, ecModel, api) {
	        this._clear();
	        createLarge(seriesModel, this.group);
	    },

	    _incrementalRenderLarge: function (params, seriesModel) {
	        createLarge(seriesModel, this.group, true);
	    },

	    dispose: noop,

	    remove: function (ecModel) {
	        this._clear(ecModel);
	    },

	    _clear: function (ecModel) {
	        var group = this.group;
	        var data = this._data;
	        if (ecModel && ecModel.get('animation') && data && !this._isLargeDraw) {
	            data.eachItemGraphicEl(function (el) {
	                if (el.type === 'sector') {
	                    removeSector(el.dataIndex, ecModel, el);
	                }
	                else {
	                    removeRect(el.dataIndex, ecModel, el);
	                }
	            });
	        }
	        else {
	            group.removeAll();
	        }
	        this._data = null;
	    }

	});
	
	echarts.extendChartView({

	    type: seriesType,

	    render: function (seriesModel, ecModel, api) {
	        var group = this.group;
	        group.removeAll();

	        var data = seriesModel.getData();

	        var itemModel = data.getItemModel(0);

	        var center = itemModel.get('center');
	        var radius = itemModel.get('radius');

	        var width = api.getWidth();
	        var height = api.getHeight();
	        var size = Math.min(width, height);
	        // itemStyle
	        var outlineDistance = 0;
	        var outlineBorderWidth = 0;
	        var showOutline = seriesModel.get('outline.show');

	        if (showOutline) {
	            outlineDistance = seriesModel.get('outline.borderDistance');
	            outlineBorderWidth = parsePercent(
	                seriesModel.get('outline.itemStyle.borderWidth'), size
	            );
	        }

	        var cx = parsePercent(center[0], width);
	        var cy = parsePercent(center[1], height);

	        var outterRadius;
	        var innerRadius;
	        var paddingRadius;

	        var isFillContainer = false;

	        var symbol = seriesModel.get('shape');
	        if (symbol === 'container') {
	            // a shape that fully fills the container
	            isFillContainer = true;

	            outterRadius = [
	                width / 2,
	                height / 2
	            ];
	            innerRadius = [
	                outterRadius[0] - outlineBorderWidth / 2,
	                outterRadius[1] - outlineBorderWidth / 2
	            ];
	            paddingRadius = [
	                parsePercent(outlineDistance, width),
	                parsePercent(outlineDistance, height)
	            ];

	            radius = [
	                innerRadius[0] - paddingRadius[0],
	                innerRadius[1] - paddingRadius[1]
	            ];
	        }
	        else {
	            outterRadius = parsePercent(radius, size) / 2;
	            innerRadius = outterRadius - outlineBorderWidth / 2;
	            paddingRadius = parsePercent(outlineDistance, size);

	            radius = innerRadius - paddingRadius;
	        }

	        if (showOutline) {
	            var outline = getOutline();
	            outline.style.lineWidth = outlineBorderWidth;
	            group.add(getOutline());
	        }

	        var left = isFillContainer ? 0 : cx - radius;
	        var top = isFillContainer ? 0 : cy - radius;

	        var wavePath = null;

	        group.add(getBackground());

	        // each data item for a wave
	        var oldData = this._data;
	        var waves = [];
	        data.diff(oldData)
	            .add(function (idx) {
	                var wave = getWave(idx, false);

	                var waterLevel = wave.shape.waterLevel;
	                wave.shape.waterLevel = isFillContainer ? radius[1] : radius;
	                echarts.graphic.initProps(wave, {
	                    shape: {
	                        waterLevel: waterLevel
	                    }
	                }, seriesModel);

	                wave.z2 = 2;
	                setWaveAnimation(idx, wave, null);

	                group.add(wave);
	                data.setItemGraphicEl(idx, wave);
	                waves.push(wave);
	            })
	            .update(function (newIdx, oldIdx) {
	                var waveElement = oldData.getItemGraphicEl(oldIdx);

	                // new wave is used to calculate position, but not added
	                var newWave = getWave(newIdx, false, waveElement);

	                // changes with animation
	                var shape = {};
	                var shapeAttrs = ['amplitude', 'cx', 'cy', 'phase', 'radius', 'waterLevel', 'waveLength'];
	                for (var i = 0; i < shapeAttrs.length; ++i) {
	                    var attr = shapeAttrs[i];
	                    if (newWave.shape.hasOwnProperty(attr)) {
	                        shape[attr] = newWave.shape[attr];
	                    }
	                }

	                var style = {};
	                var styleAttrs = ['fill', 'opacity', 'shadowBlur', 'shadowColor'];
	                for (var i = 0; i < styleAttrs.length; ++i) {
	                    var attr = shapeAttrs[i];
	                    if (newWave.style.hasOwnProperty(attr)) {
	                        style[attr] = newWave.style[attr];
	                    }
	                }

	                // changes with animation
	                echarts.graphic.updateProps(waveElement, {
	                    shape: shape,
	                    style: style
	                }, seriesModel);

	                // instant changes
	                waveElement.position = newWave.position;
	                waveElement.setClipPath(newWave.clipPath);
	                waveElement.shape.inverse = newWave.inverse;

	                setWaveAnimation(newIdx, waveElement, waveElement);
	                group.add(waveElement);
	                data.setItemGraphicEl(newIdx, waveElement);
	                waves.push(waveElement);
	            })
	            .remove(function (idx) {
	                var wave = oldData.getItemGraphicEl(idx);
	                group.remove(wave);
	            })
	            .execute();

	        if (itemModel.get('label.show')) {
	            group.add(getText(waves));
	        }

	        this._data = data;

	        /**
	         * Get path for outline, background and clipping
	         *
	         * @param {number} r outter radius of shape
	         * @param {boolean|undefined} isForClipping if the shape is used
	         *                                          for clipping
	         */
	        function getPath(r, isForClipping) {
	            if (symbol) {
	                // customed symbol path
	                if (symbol.indexOf('path://') === 0) {
	                    var path = echarts.graphic.makePath(symbol.slice(7), {});
	                    var bouding = path.getBoundingRect();
	                    var w = bouding.width;
	                    var h = bouding.height;
	                    if (w > h) {
	                        h = r * 2 / w * h;
	                        w = r * 2;
	                    }
	                    else {
	                        w = r * 2 / h * w;
	                        h = r * 2;
	                    }

	                    var left = isForClipping ? 0 : cx - w / 2;
	                    var top = isForClipping ? 0 : cy - h / 2;
	                    path = echarts.graphic.makePath(
	                        symbol.slice(7),
	                        {},
	                        new echarts.graphic.BoundingRect(left, top, w, h)
	                    );
	                    if (isForClipping) {
	                        path.position = [-w / 2, -h / 2];
	                    }
	                    return path;
	                }
	                else if (isFillContainer) {
	                    // fully fill the container
	                    var x = isForClipping ? -r[0] : cx - r[0];
	                    var y = isForClipping ? -r[1] : cy - r[1];
	                    return symbolUtil.createSymbol(
	                        'rect', x, y, r[0] * 2, r[1] * 2
	                    );
	                }
	                else {
	                    var x = isForClipping ? -r : cx - r;
	                    var y = isForClipping ? -r : cy - r;
	                    if (symbol === 'pin') {
	                        y += r;
	                    }
	                    else if (symbol === 'arrow') {
	                        y -= r;
	                    }
	                    return symbolUtil.createSymbol(symbol, x, y, r * 2, r * 2);
	                }
	            }

	            return new echarts.graphic.Circle({
	                shape: {
	                    cx: isForClipping ? 0 : cx,
	                    cy: isForClipping ? 0 : cy,
	                    r: r
	                }
	            });
	        }
	        /**
	         * Create outline
	         */
	        function getOutline() {
	            var outlinePath = getPath(outterRadius);
	            outlinePath.style.fill = null;

	            outlinePath.setStyle(seriesModel.getModel('outline.itemStyle')
	                .getItemStyle());

	            return outlinePath;
	        }

	        /**
	         * Create background
	         */
	        function getBackground() {
	            // Seperate stroke and fill, so we can use stroke to cover the alias of clipping.
	            var strokePath = getPath(radius);
	            strokePath.setStyle(seriesModel.getModel('backgroundStyle')
	                .getItemStyle());
	            strokePath.style.fill = null;

	            // Stroke is front of wave
	            strokePath.z2 = 5;

	            var fillPath = getPath(radius);
	            fillPath.setStyle(seriesModel.getModel('backgroundStyle')
	                .getItemStyle());
	            fillPath.style.stroke = null;

	            var group = new echarts.graphic.Group();
	            group.add(strokePath);
	            group.add(fillPath);

	            return group;
	        }

	        /**
	         * wave shape
	         */
	        function getWave(idx, isInverse, oldWave) {
	            var radiusX = isFillContainer ? radius[0] : radius;
	            var radiusY = isFillContainer ? radius[1] : radius;

	            var itemModel = data.getItemModel(idx);
	            var itemStyleModel = itemModel.getModel('itemStyle');
	            var phase = itemModel.get('phase');
	            var amplitude = parsePercent(itemModel.get('amplitude'),
	                radiusY * 2);
	            var waveLength = parsePercent(itemModel.get('waveLength'),
	                radiusX * 2);

	            var value = data.get('value', idx);
	            var waterLevel = radiusY - value * radiusY * 2;
	            phase = oldWave ? oldWave.shape.phase
	                : (phase === 'auto' ? idx * Math.PI / 4 : phase);
	            var normalStyle = itemStyleModel.getItemStyle();
	            if (!normalStyle.fill) {
	                var seriesColor = seriesModel.get('color');
	                var id = idx % seriesColor.length;
	                normalStyle.fill = seriesColor[id];
	            }

	            var x = radiusX * 2;
	            var wave = new LiquidLayout({
	                shape: {
	                    waveLength: waveLength,
	                    radius: radiusX,
	                    cx: x,
	                    cy: 0,
	                    waterLevel: waterLevel,
	                    amplitude: amplitude,
	                    phase: phase,
	                    inverse: isInverse
	                },
	                style: normalStyle,
	                position: [cx, cy]
	            });
	            wave.shape._waterLevel = waterLevel;

	            var hoverStyle = itemModel.getModel('emphasis.itemStyle')
	                .getItemStyle();
	            hoverStyle.lineWidth = 0;
	            echarts.graphic.setHoverStyle(wave, hoverStyle);

	            // clip out the part outside the circle
	            var clip = getPath(radius, true);
	            // set fill for clipPath, otherwise it will not trigger hover event
	            clip.setStyle({
	                fill: 'white'
	            });
	            wave.setClipPath(clip);

	            return wave;
	        }

	        function setWaveAnimation(idx, wave, oldWave) {
	            var itemModel = data.getItemModel(idx);

	            var maxSpeed = itemModel.get('period');
	            var direction = itemModel.get('direction');

	            var value = data.get('value', idx);

	            var phase = itemModel.get('phase');
	            phase = oldWave ? oldWave.shape.phase
	                : (phase === 'auto' ? idx * Math.PI / 4 : phase);

	            var defaultSpeed = function (maxSpeed) {
	                var cnt = data.count();
	                return cnt === 0 ? maxSpeed : maxSpeed *
	                    (0.2 + (cnt - idx) / cnt * 0.8);
	            };
	            var speed = 0;
	            if (maxSpeed === 'auto') {
	                speed = defaultSpeed(5000);
	            }
	            else {
	                speed = typeof maxSpeed === 'function'
	                    ? maxSpeed(value, idx) : maxSpeed;
	            }

	            // phase for moving left/right
	            var phaseOffset = 0;
	            if (direction === 'right' || direction == null) {
	                phaseOffset = Math.PI;
	            }
	            else if (direction === 'left') {
	                phaseOffset = -Math.PI;
	            }
	            else if (direction === 'none') {
	                phaseOffset = 0;
	            }
	            else {
	                console.error('Illegal direction value for liquid fill.');
	            }

	            // wave animation of moving left/right
	            if (direction !== 'none' && itemModel.get('waveAnimation')) {
	                wave
	                    .animate('shape', true)
	                    .when(0, {
	                        phase: phase
	                    })
	                    .when(speed / 2, {
	                        phase: phaseOffset + phase
	                    })
	                    .when(speed, {
	                        phase: phaseOffset * 2 + phase
	                    })
	                    .during(function () {
	                        if (wavePath) {
	                            wavePath.dirty(true);
	                        }
	                    })
	                    .start();
	            }
	        }

	        /**
	         * text on wave
	         */
	        function getText(waves) {
	            var labelModel = itemModel.getModel('label');

	            function formatLabel() {
	                var formatted = seriesModel.getFormattedLabel(0, 'normal');
	                var defaultVal = (data.get('value', 0) * 100);
	                var defaultLabel = data.getName(0) || seriesModel.name;
	                if (!isNaN(defaultVal)) {
	                    defaultLabel = defaultVal.toFixed(0) + '%';
	                }
	                return formatted == null ? defaultLabel : formatted;
	            }

	            var textOption = {
	                z2: 10,
	                shape: {
	                    x: left,
	                    y: top,
	                    width: (isFillContainer ? radius[0] : radius) * 2,
	                    height: (isFillContainer ? radius[1] : radius) * 2
	                },
	                style: {
	                    fill: 'transparent',
	                    text: formatLabel(),
	                    textAlign: labelModel.get('align'),
	                    textVerticalAlign: labelModel.get('baseline')
	                },
	                silent: true
	            };

	            var outsideTextRect = new echarts.graphic.Rect(textOption);
	            var color = labelModel.get('color');
	            echarts.graphic.setText(outsideTextRect.style, labelModel, color);

	            var insideTextRect = new echarts.graphic.Rect(textOption);
	            var insColor = labelModel.get('insideColor');
	            echarts.graphic.setText(insideTextRect.style, labelModel, insColor);
	            insideTextRect.style.textFill = insColor;

	            var group = new echarts.graphic.Group();
	            group.add(outsideTextRect);
	            group.add(insideTextRect);

	            // clip out waves for insideText
	            var boundingCircle = getPath(radius, true);

	            wavePath = new echarts.graphic.CompoundPath({
	                shape: {
	                    paths: waves
	                },
	                position: [cx, cy]
	            });

	            wavePath.setClipPath(boundingCircle);
	            insideTextRect.setClipPath(wavePath);

	            return group;
	        }
	    },

	    dispose: function () {
	        // dispose nothing here
	    }
	});
	
})));