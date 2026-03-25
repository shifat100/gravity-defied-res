// Data Structures mapping Java classes
class Point2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Level {
    constructor(copyFrom = null) {
        this.Name = copyFrom ? copyFrom.Name : "";
        this.x0 = copyFrom ? copyFrom.x0 : 0;
        this.y0 = copyFrom ? copyFrom.y0 : 0;
        this.xEnd = copyFrom ? copyFrom.xEnd : 0;
        this.yEnd = copyFrom ? copyFrom.yEnd : 0;
        this.pPoints = [];
        
        if (copyFrom) {
            for (let pt of copyFrom.pPoints) {
                this.pPoints.push(new Point2(pt.x, pt.y));
            }
        }
    }
}

class League {
    constructor() {
        this.pLevels = [];
    }
}

// Binary IO Tools mapping Java DataInputStream / DataOutputStream
class BinaryReader {
    constructor(buffer) {
        this.dv = new DataView(buffer);
        this.pos = 0;
    }
    readByte() { let v = this.dv.getInt8(this.pos); this.pos++; return v; }
    readUByte() { let v = this.dv.getUint8(this.pos); this.pos++; return v; }
    readShort() { let v = this.dv.getInt16(this.pos, false); this.pos += 2; return v; }
    readInt() { let v = this.dv.getInt32(this.pos, false); this.pos += 4; return v; }
    readString() {
        let res = "";
        while (true) {
            let b = this.readUByte();
            if (b === 0) break;
            res += String.fromCharCode(b);
        }
        return res;
    }
}

class BinaryWriter {
    constructor(size) {
        this.buffer = new ArrayBuffer(size);
        this.dv = new DataView(this.buffer);
        this.pos = 0;
        this.maxPos = 0;
    }
    writeByte(v) { this.dv.setInt8(this.pos, v); this.pos++; this.updateMax(); }
    writeShort(v) { this.dv.getInt16(this.pos, v, false); this.pos += 2; this.updateMax(); } // Actually setInt16
    writeShort(v) { this.dv.setInt16(this.pos, v, false); this.pos += 2; this.updateMax(); }
    writeInt(v) { this.dv.setInt32(this.pos, v, false); this.pos += 4; this.updateMax(); }
    writeString(str) {
        for (let i = 0; i < str.length; i++) {
            this.dv.setUint8(this.pos, str.charCodeAt(i));
            this.pos++;
        }
        this.dv.setUint8(this.pos, 0);
        this.pos++;
        this.updateMax();
    }
    updateMax() { if (this.pos > this.maxPos) this.maxPos = this.pos; }
    getBuffer() { return this.buffer.slice(0, this.maxPos); }
}

class Levels {
    constructor() {
        this.leagues = [new League(), new League(), new League()];
    }

    Load(buffer) {
        try {
            let br = new BinaryReader(buffer);
            let offsets = [[], [], []];

            for (let i = 0; i < 3; i++) {
                let count = br.readInt();
                this.leagues[i] = new League();
                for (let j = 0; j < count; j++) {
                    offsets[i].push(br.readInt());
                    let lvl = new Level();
                    lvl.Name = br.readString();
                    this.leagues[i].pLevels.push(lvl);
                }
            }

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < this.leagues[i].pLevels.length; j++) {
                    br.pos = offsets[i][j];
                    let lvl = this.leagues[i].pLevels[j];
                    br.readByte(); // magic 51
                    lvl.x0 = (br.readInt() >> 16) << 3;
                    lvl.y0 = (br.readInt() >> 16) << 3;
                    lvl.xEnd = (br.readInt() >> 16) << 3;
                    lvl.yEnd = (br.readInt() >> 16) << 3;
                    let pCount = br.readShort();
                    
                    let px = br.readInt();
                    let py = br.readInt();
                    lvl.pPoints.push(new Point2(px, py));

                    for (let k = 1; k < pCount; k++) {
                        let dx = br.readByte();
                        let dy = 0;
                        if (dx === -1) {
                            px += br.readInt();
                            py += br.readInt();
                        } else {
                            px += dx;
                            py += br.readByte();
                        }
                        lvl.pPoints.push(new Point2(px, py));
                    }
                }
            }
            return true;
        } catch (e) {
            console.error("Failed to parse levels.mrg", e);
            return false;
        }
    }

    Save() {
        let bw = new BinaryWriter(2 * 1024 * 1024); // 2MB buffer should suffice
        let pOffsetsPos = [[], [], []];

        // 1. Write Header
        for (let i = 0; i < 3; i++) {
            let league = this.leagues[i];
            bw.writeInt(league.pLevels.length);
            for (let j = 0; j < league.pLevels.length; j++) {
                pOffsetsPos[i].push(bw.pos);
                bw.writeInt(0); // placeholder
                bw.writeString(league.pLevels[j].Name);
            }
        }

        let actualOffsets = [[], [], []];

        // 2. Write Level Data
        for (let i = 0; i < 3; i++) {
            let league = this.leagues[i];
            for (let j = 0; j < league.pLevels.length; j++) {
                let lvl = league.pLevels[j];
                actualOffsets[i].push(bw.pos);
                bw.writeByte(51); // 0x33

                bw.writeInt((lvl.x0 << 16) >> 3);
                bw.writeInt((lvl.y0 << 16) >> 3);
                bw.writeInt((lvl.xEnd << 16) >> 3);
                bw.writeInt((lvl.yEnd << 16) >> 3);
                
                bw.writeShort(lvl.pPoints.length);
                let p0 = lvl.pPoints[0];
                bw.writeInt(p0 ? p0.x : 0);
                bw.writeInt(p0 ? p0.y : 0);

                for (let k = 1; k < lvl.pPoints.length; k++) {
                    let p = lvl.pPoints[k];
                    let prev = lvl.pPoints[k - 1];
                    bw.writeByte(p.x - prev.x);
                    bw.writeByte(p.y - prev.y);
                }
            }
        }

        // 3. Patch Offsets
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < pOffsetsPos[i].length; j++) {
                bw.pos = pOffsetsPos[i][j];
                bw.writeInt(actualOffsets[i][j]);
            }
        }

        return bw.getBuffer();
    }

    CreateDefault() {
        let lvl = new Level();
        lvl.Name = "New level";
        lvl.x0 = -70; lvl.y0 = -90; lvl.xEnd = 70; lvl.yEnd = -110;
        for (let x = -100; x < 100; x += 30) {
            lvl.pPoints.push(new Point2(x, -110));
        }
        this.leagues[0].pLevels.push(lvl);
    }
}

// Fallback CustomFont (using Canvas 2D Text API instead of requiring external images)
class CustomFont {
    constructor() {
        this.height = 12;
    }
    drawString(ctx, str, x, y) {
        ctx.fillStyle = "#000037";
        ctx.font = "bold 12px monospace";
        ctx.fillText(str, x, y + 10);
    }
}

// Application Loop and Renderer
class EditorApp {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.levels = new Levels();
        this.font = new CustomFont();

        this.bPaused = false;
        this.uiOpen = false;
        this.camX = 0;
        this.camY = 0;
        this.curLevel = 0;
        this.curTrack = 0;
        
        this.iCurVertex = -1;
        this.sStatus = "Ready";
        this.iStatusTimeout = 2000;
        
        this.keys = new Array(16).fill(false); // matches Java keys tracking
        this.nSpeed = 100;

        this.bCanLeft = true;
        this.bCanRight = true;
        this.bCanUp = true;
        this.bCanDown = true;
        this.lTimeInMove = 0;
        this.lastTime = performance.now();

        // J2ME array bindings
        this.KEY_LEFT = 0;
        this.KEY_RIGHT = 1;
        this.KEY_UP = 2;
        this.KEY_DOWN = 3;
        this.KEY_MOD = 10; // "Shift" replaces '7' in J2ME

        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.bindKeys();
        this.initUI();
        
        // Ensure starting data isn't completely empty
        this.levels.CreateDefault();

        requestAnimationFrame((ts) => this.paint(ts));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setStatus(msg, timeout = 1000) {
        this.sStatus = msg;
        this.iStatusTimeout = timeout;
    }

    bindKeys() {
        window.addEventListener("keydown", (e) => this.handleKey(e, true));
        window.addEventListener("keyup", (e) => this.handleKey(e, false));
    }

    handleKey(e, isDown) {
        if (this.uiOpen) return;
        let mapped = false;

        if (e.code === "ArrowLeft") { this.keys[this.KEY_LEFT] = isDown; mapped = true; }
        else if (e.code === "ArrowRight") { this.keys[this.KEY_RIGHT] = isDown; mapped = true; }
        else if (e.code === "ArrowUp") { this.keys[this.KEY_UP] = isDown; mapped = true; }
        else if (e.code === "ArrowDown") { this.keys[this.KEY_DOWN] = isDown; mapped = true; }
        else if (e.code === "ShiftLeft" || e.code === "ShiftRight") { this.keys[this.KEY_MOD] = isDown; mapped = true; }

        if (isDown) {
            // Space => Java #35 (Add Point)
            if (e.code === "Space") {
                this.cmdAddPoint();
                mapped = true;
            }
            // Delete => Java #42 (Del Point)
            else if (e.code === "Delete" || e.code === "Backspace") {
                this.cmdDelPoint();
                mapped = true;
            }
        }

        if (!isDown && (e.code === "ShiftLeft" || e.code === "ShiftRight")) {
            this.bCanLeft = true; this.bCanRight = true;
            this.bCanUp = true; this.bCanDown = true;
        }

        if (mapped) e.preventDefault();
    }

    cmdAddPoint() {
        let pt = new Point2();
        let lvl = this.levels.leagues[this.curLevel].pLevels[this.curTrack];
        if (!lvl) return;
        
        let insertIdx = 0;
        for (let i = 0; i < lvl.pPoints.length; i++) {
            if (lvl.pPoints[i].x < this.camX) insertIdx = i;
        }

        pt.x = this.camX;
        pt.y = this.camY - 110;
        lvl.pPoints.splice(insertIdx + 1, 0, pt);
        this.setStatus(`add (${pt.x},${pt.y})`);
    }

    cmdDelPoint() {
        let lvl = this.levels.leagues[this.curLevel].pLevels[this.curTrack];
        if (!lvl) return;
        
        if (this.iCurVertex > 0 && this.iCurVertex < lvl.pPoints.length - 1) {
            lvl.pPoints.splice(this.iCurVertex, 1);
            this.setStatus(`del [${this.iCurVertex}]`);
            this.iCurVertex = -1;
        } else if (this.iCurVertex === 0) {
            this.setStatus("Can't delete 1st point");
        } else if (this.iCurVertex === lvl.pPoints.length - 1) {
            this.setStatus("Can't delete last point");
        }
    }

    paint(timestamp) {
        requestAnimationFrame((ts) => this.paint(ts));
        if (this.uiOpen) {
            this.lastTime = timestamp; // avoid massive dt skip
            return;
        }

        let dt = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        if (this.iStatusTimeout > 0) {
            this.iStatusTimeout -= dt;
            if (this.iStatusTimeout <= 0) this.sStatus = "";
        }

        // Java exact speed logic
        let speed = Math.floor((dt * this.nSpeed) / 1000);
        if (speed > 2) speed = 2; // Exact capping from Java

        let moving = false;
        if (this.keys[this.KEY_UP] && this.bCanUp) { this.camY += speed; moving = true; }
        if (this.keys[this.KEY_DOWN] && this.bCanDown) { this.camY -= speed; moving = true; }
        if (this.keys[this.KEY_LEFT] && this.bCanLeft) { this.camX -= speed; moving = true; }
        if (this.keys[this.KEY_RIGHT] && this.bCanRight) { this.camX += speed; moving = true; }

        if (moving) this.lTimeInMove += dt;
        else this.lTimeInMove = 0;

        let w = this.canvas.width;
        let h = this.canvas.height;
        let ctx = this.ctx;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        let lvl = this.levels.leagues[this.curLevel].pLevels[this.curTrack];

        if (!lvl) {
            ctx.fillStyle = "rgb(210, 210, 255)";
            ctx.fillRect(0, 0, w, this.font.height + 2);
            ctx.strokeStyle = "rgb(0, 0, 55)";
            ctx.beginPath(); ctx.moveTo(0, this.font.height + 2); ctx.lineTo(w, this.font.height + 2); ctx.stroke();
            this.font.drawString(ctx, "No level", 1, 2);
            return;
        }

        // Start Java Drawing Port
        let horizonY = this.camY + h / 2;
        ctx.strokeStyle = "rgb(100, 100, 255)";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(0, horizonY); ctx.lineTo(w, horizonY);
        ctx.moveTo(w / 2 - this.camX, horizonY - 8); ctx.lineTo(w / 2 - this.camX, horizonY + 8);
        ctx.stroke();

        let distX = Math.abs(this.camX - lvl.x0);
        let distY = Math.abs(this.camY - lvl.y0 - 110);

        if (distX < 10 && distY < 10) {
            if (!moving) {
                this.camX = lvl.x0;
                this.camY = lvl.y0 + 110;
            } else if (this.keys[this.KEY_MOD]) {
                if (this.keys[this.KEY_UP]) lvl.y0 += speed;
                if (this.keys[this.KEY_DOWN]) lvl.y0 -= speed;
                if (this.keys[this.KEY_LEFT]) lvl.x0 -= speed;
                if (this.keys[this.KEY_RIGHT]) lvl.x0 += speed;
            }
        }

        ctx.strokeStyle = "rgb(0, 0, 255)";
        ctx.beginPath();
        ctx.moveTo(w / 2 - this.camX + lvl.xEnd - 2, 0); ctx.lineTo(w / 2 - this.camX + lvl.xEnd - 2, h);
        ctx.moveTo(w / 2 - this.camX + lvl.xEnd + 2, 0); ctx.lineTo(w / 2 - this.camX + lvl.xEnd + 2, h);
        ctx.stroke();

        distX = Math.abs(this.camX - lvl.xEnd);
        if (distX <= 2 && this.keys[this.KEY_MOD]) {
            if (this.keys[this.KEY_LEFT]) lvl.xEnd -= speed;
            if (this.keys[this.KEY_RIGHT]) lvl.xEnd += speed;
        }

        let isVertexSelected = false;

        for (let i = 0; i < lvl.pPoints.length; i++) {
            let pt = lvl.pPoints[i];
            let nextPt = i < lvl.pPoints.length - 1 ? lvl.pPoints[i + 1] : null;
            let prevPt = i > 0 ? lvl.pPoints[i - 1] : null;

            let nx = 0, ny = 0;
            if (nextPt) {
                nx = -this.camX + w / 2 + nextPt.x;
                ny = this.camY + h / 2 - nextPt.y - 110;
            }

            let px = -this.camX + w / 2 + pt.x;
            let py = this.camY + h / 2 - pt.y - 110;

            // Simple frustum culling matching J2ME roughly
            if ((px >= 0 && px <= w && py >= 0 && py <= h) || (nextPt && (nx >= 0 || px >= 0) && (nx <= w || px <= w))) {
                
                let distCamX = Math.abs(this.camX - pt.x);
                let distCamY = Math.abs(this.camY - pt.y - 110);

                if (distCamX <= 2 && distCamY <= 2 && !isVertexSelected) {
                    this.iCurVertex = i;
                    isVertexSelected = true;

                    if (!moving) {
                        this.camX = pt.x;
                        this.camY = pt.y + 110;
                    } else if (this.keys[this.KEY_MOD]) {
                        if (this.keys[this.KEY_UP]) pt.y += speed;
                        if (this.keys[this.KEY_DOWN]) pt.y -= speed;
                        if (this.keys[this.KEY_LEFT]) pt.x -= speed;
                        if (this.keys[this.KEY_RIGHT]) pt.x += speed;

                        // Java strict byte limits constraint port
                        if (i !== 0 && prevPt) {
                            if (pt.x - prevPt.x > 127) { pt.x = prevPt.x + 127; this.bCanRight = false; } else this.bCanRight = true;
                            if (pt.x - prevPt.x <= 4) { this.bCanLeft = false; pt.x = prevPt.x + 4; } else this.bCanLeft = true;
                            if (pt.y - prevPt.y > 127) { pt.y = prevPt.y + 127; this.bCanUp = false; } else this.bCanUp = true;
                            if (pt.y - prevPt.y < -127) { pt.y = prevPt.y - 127; this.bCanDown = false; } else this.bCanDown = true;
                        }

                        if (i !== lvl.pPoints.length - 1 && nextPt) {
                            if (pt.x - nextPt.x < -127) { pt.x = nextPt.x - 127; this.bCanLeft = false; } else this.bCanLeft = true;
                            if (nextPt.x - pt.x <= 4) { pt.x = nextPt.x - 4; this.bCanRight = false; } else this.bCanRight = true;
                            if (pt.y - nextPt.y > 127) { pt.y = nextPt.y + 127; this.bCanUp = false; } else this.bCanUp = true;
                            if (pt.y - nextPt.y < -127) { pt.y = nextPt.y - 127; this.bCanDown = false; } else this.bCanDown = true;
                        }

                        this.camX = pt.x;
                        this.camY = pt.y + 110;
                    }
                }

                if (nextPt) {
                    ctx.strokeStyle = (nx - px > 127) ? "rgb(255, 0, 0)" : "rgb(0, 255, 0)";
                    ctx.beginPath();
                    ctx.moveTo(px, py); ctx.lineTo(nx, ny);
                    ctx.stroke();
                }

                ctx.fillStyle = "rgb(0, 140, 0)";
                ctx.fillRect(px - 2, py - 2, 4, 4);
            }
        }

        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.beginPath();
        ctx.arc(-this.camX + w / 2 + lvl.x0, -110 + this.camY + h / 2 - lvl.y0, 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2 + 8, h / 2 + 4);
        ctx.moveTo(w / 2 + 8, h / 2 + 4); ctx.lineTo(w / 2 + 4, h / 2 + 8);
        ctx.moveTo(w / 2 + 4, h / 2 + 8); ctx.lineTo(w / 2, h / 2);
        ctx.stroke();

        this.font.drawString(ctx, `(${this.camX},${this.camY})`, w / 2 + 2, h / 2 + 10);

        ctx.fillStyle = "rgb(210, 210, 255)";
        ctx.fillRect(0, 0, w, this.font.height + 2);
        ctx.strokeStyle = "rgb(0, 0, 55)";
        ctx.beginPath(); ctx.moveTo(0, this.font.height + 2); ctx.lineTo(w, this.font.height + 2); ctx.stroke();
        this.font.drawString(ctx, lvl.Name, 1, 2);

        ctx.fillStyle = "rgb(210, 210, 255)";
        ctx.fillRect(0, h - this.font.height - 2, w, this.font.height + 2);
        ctx.beginPath(); ctx.moveTo(0, h - this.font.height - 2); ctx.lineTo(w, h - this.font.height - 2); ctx.stroke();
        this.font.drawString(ctx, this.sStatus, 1, h - this.font.height);
    }

    // --- UI Logic ---
    initUI() {
        this.domMenuOverlay = document.getElementById("menuOverlay");
        this.domPropOverlay = document.getElementById("propOverlay");
        this.selLeague = document.getElementById("selLeague");
        this.selLevel = document.getElementById("selLevel");
        
        document.getElementById("btnMenu").onclick = () => this.openMenu();
        document.getElementById("btnCloseMenu").onclick = () => this.closeMenu();
        
        this.selLeague.onchange = () => this.updateLevelList();
        this.selLevel.ondblclick = () => this.closeMenu(); // jump to level

        document.getElementById("btnNew").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvl = new Level();
            lvl.Name = "New level";
            lvl.x0 = -70; lvl.y0 = -90; lvl.xEnd = 70; lvl.yEnd = -110;
            for (let x = -100; x < 100; x += 30) lvl.pPoints.push(new Point2(x, -110));
            this.levels.leagues[lIdx].pLevels.push(lvl);
            this.updateLevelList();
            this.selLevel.selectedIndex = this.levels.leagues[lIdx].pLevels.length - 1;
        };

        document.getElementById("btnRemove").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            if (lvlIdx >= 0) {
                this.levels.leagues[lIdx].pLevels.splice(lvlIdx, 1);
                this.updateLevelList();
            }
        };

        document.getElementById("btnMoveUp").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            if (lvlIdx > 0) {
                let arr = this.levels.leagues[lIdx].pLevels;
                let tmp = arr[lvlIdx];
                arr[lvlIdx] = arr[lvlIdx - 1];
                arr[lvlIdx - 1] = tmp;
                this.updateLevelList();
                this.selLevel.selectedIndex = lvlIdx - 1;
            }
        };

        document.getElementById("btnMoveDown").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            let arr = this.levels.leagues[lIdx].pLevels;
            if (lvlIdx >= 0 && lvlIdx < arr.length - 1) {
                let tmp = arr[lvlIdx];
                arr[lvlIdx] = arr[lvlIdx + 1];
                arr[lvlIdx + 1] = tmp;
                this.updateLevelList();
                this.selLevel.selectedIndex = lvlIdx + 1;
            }
        };

        let copyBuffer = null;
        document.getElementById("btnCopy").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            if (lvlIdx >= 0) {
                copyBuffer = new Level(this.levels.leagues[lIdx].pLevels[lvlIdx]);
                this.setStatus("Level Copied");
            }
        };

        document.getElementById("btnPaste").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            if (copyBuffer) {
                let inst = new Level(copyBuffer);
                this.levels.leagues[lIdx].pLevels.splice(lvlIdx + 1, 0, inst);
                this.updateLevelList();
                this.selLevel.selectedIndex = lvlIdx + 1;
            }
        };

        // File loading
        document.getElementById("fileLoad").onchange = (e) => {
            if (e.target.files.length > 0) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = (evt) => {
                    if (this.levels.Load(evt.target.result)) {
                        this.updateLevelList();
                        this.setStatus("Loaded " + file.name);
                    } else {
                        alert("Failed to load levels.mrg");
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        };

        // File saving
        document.getElementById("btnSave").onclick = () => {
            let buffer = this.levels.Save();
            let blob = new Blob([buffer], { type: "application/octet-stream" });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "levels.mrg";
            a.click();
            URL.revokeObjectURL(a.href);
            this.setStatus("Saved file");
        };

        // Properties
        document.getElementById("btnProp").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            if (lvlIdx >= 0) {
                document.getElementById("inpLevelName").value = this.levels.leagues[lIdx].pLevels[lvlIdx].Name;
                this.domPropOverlay.style.display = "flex";
            }
        };

        document.getElementById("btnPropOk").onclick = () => {
            let lIdx = parseInt(this.selLeague.value);
            let lvlIdx = this.selLevel.selectedIndex;
            this.levels.leagues[lIdx].pLevels[lvlIdx].Name = document.getElementById("inpLevelName").value;
            this.domPropOverlay.style.display = "none";
            this.updateLevelList();
        };

        document.getElementById("btnPropCancel").onclick = () => {
            this.domPropOverlay.style.display = "none";
        };
    }

    openMenu() {
        this.uiOpen = true;
        this.domMenuOverlay.style.display = "flex";
        this.selLeague.value = this.curLevel;
        this.updateLevelList();
        this.selLevel.selectedIndex = this.curTrack;
    }

    closeMenu() {
        let lIdx = parseInt(this.selLeague.value);
        let lvlIdx = this.selLevel.selectedIndex;
        if (lIdx >= 0 && lvlIdx >= 0) {
            this.curLevel = lIdx;
            this.curTrack = lvlIdx;
        }
        this.uiOpen = false;
        this.domMenuOverlay.style.display = "none";
        this.camX = 0;
        this.camY = 0;
    }

    updateLevelList() {
        let lIdx = parseInt(this.selLeague.value);
        let league = this.levels.leagues[lIdx];
        this.selLevel.innerHTML = "";
        for (let i = 0; i < league.pLevels.length; i++) {
            let opt = document.createElement("option");
            opt.value = i;
            opt.innerText = league.pLevels[i].Name || `[Level ${i+1}]`;
            this.selLevel.appendChild(opt);
        }
    }
}

// Bootstrap
window.onload = () => {
    window.app = new EditorApp();
};
