﻿/// <reference path="FaceAPI.ts" />

/// <reference path="../../samchon/protocol/Entity.ts" />
/// <reference path="IJSonEntity.ts" />

namespace hiswill.faceapi
{
    /**
     * An entity representing coordinates X and Y.
     *
     * @author Jeongho Nam
     */
    export class Point
        extends samchon.protocol.Entity
        implements IJSONEntity 
    {
        /**
         * A tag name for converting with XML.
         */
        protected tag: string;

        /**
         * Coordinate X
         */
        protected x: number;

        /**
         * Coordinate Y
         */
        protected y: number;

        /* --------------------------------------------------------
            CONSTRUCTORS
        -------------------------------------------------------- */
        /**
         * Default Constructor.
         */
        public constructor();
        
        /**
         * Construct from a XML tag name.
         */
        public constructor(tag: string);

        public constructor(tag: string = "") 
        {
            super();

            this.tag = tag;
            this.x = 0;
            this.y = 0;
        }
    
        /**
         * @inheritdoc
         */
        public constructByJSON(val: any): void 
        {
            Global.fetch(this, val);
        }

        /* --------------------------------------------------------
            GETTERS
        -------------------------------------------------------- */
        /**
         * Get coordinate X.
         */
        public getX(): number
        {
            return this.x;
        }

        /**
         * Get coordinate Y.
         */
        public getY(): number
        {
            return this.y;
        }

        /* --------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public TAG(): string 
        {
            return this.tag;
        }

        /**
         * @inheritdoc
         */
        public toXML(): samchon.library.XML
        {
            var xml: samchon.library.XML = super.toXML();
            xml.eraseProperty("tag");

            return xml;
        }
    }
}