var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hiswill;
(function (hiswill) {
    var faceAPI;
    (function (faceAPI) {
        var face;
        (function (face) {
            var landmark;
            (function (landmark) {
                var Eyebrow = (function (_super) {
                    __extends(Eyebrow, _super);
                    function Eyebrow(eyeBrows, direction) {
                        _super.call(this);
                        this.eyeBrows = eyeBrows;
                        this.direction = direction;
                        this.inner = new faceAPI.basic.Point("inner");
                        this.outer = new faceAPI.basic.Point("outer");
                    }
                    Eyebrow.prototype.constructByJSON = function (obj) {
                        if (this.direction == faceAPI.Direction.LEFT) {
                            this.inner.constructByJSON(obj["eyebrowLeftInner"]);
                            this.outer.constructByJSON(obj["eyebrowLeftOuter"]);
                        }
                        else {
                            this.inner.constructByJSON(obj["eyebrowRightInner"]);
                            this.outer.constructByJSON(obj["eyebrowRightOuter"]);
                        }
                    };
                    Eyebrow.prototype.getEyeBrows = function () {
                        return this.eyeBrows;
                    };
                    Eyebrow.prototype.getOpposite = function () {
                        if (this.direction == faceAPI.Direction.LEFT)
                            return this.eyeBrows.getRight();
                        else
                            return this.eyeBrows.getLeft();
                    };
                    Eyebrow.prototype.getInner = function () {
                        return this.inner;
                    };
                    Eyebrow.prototype.getOuter = function () {
                        return this.outer;
                    };
                    Eyebrow.prototype.TAG = function () {
                        if (this.direction == faceAPI.Direction.LEFT)
                            return "left";
                        else
                            return "right";
                    };
                    Eyebrow.prototype.toXML = function () {
                        var xml = _super.prototype.toXML.call(this);
                        xml.eraseProperty("direction");
                        xml.push(this.inner.toXML(), this.outer.toXML());
                        return xml;
                    };
                    return Eyebrow;
                })(Entity);
                landmark.Eyebrow = Eyebrow;
            })(landmark = face.landmark || (face.landmark = {}));
        })(face = faceAPI.face || (faceAPI.face = {}));
    })(faceAPI = hiswill.faceAPI || (hiswill.faceAPI = {}));
})(hiswill || (hiswill = {}));