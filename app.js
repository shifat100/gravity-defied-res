/**
 * Exact J2ME Gravity Editor Port
 * Architecture perfectly mimics Java MIDP LCDUI Forms, Lists, and Canvas.
 */

// --- UTILS & DATA TYPES ---
class Point2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
}

class Level {
    constructor(var1 = null) {
        this.Name = var1 ? var1.Name : "";
        this.x0 = var1 ? var1.x0 : 0;
        this.y0 = var1 ? var1.y0 : 0;
        this.xEnd = var1 ? var1.xEnd : 0;
        this.yEnd = var1 ? var1.yEnd : 0;
        this.pPoints = [];
        if (var1) {
            for (let pt of var1.pPoints) this.pPoints.push(new Point2(pt.x, pt.y));
        }
    }
    Count() { return this.pPoints.length; }
    AddPoint(pt) { this.pPoints.push(pt); }
    InsertPoint(idx, pt) { this.pPoints.splice(idx, 0, pt); }
    RemovePoint(idx) { this.pPoints.splice(idx, 1); }
    GetPoint(idx) { return this.pPoints[idx]; }
}

class League {
    constructor() { this.pLevels = []; }
    Count() { return this.pLevels.length; }
    GetLevel(idx) { return (idx >= 0 && idx < this.pLevels.length) ? this.pLevels[idx] : null; }
    AddLevel(lvl) { this.pLevels.push(lvl); }
    RemoveLevel(idx) { this.pLevels.splice(idx, 1); }
    Swap(i1, i2) {
        let tmp = this.pLevels[i1];
        this.pLevels[i1] = this.pLevels[i2];
        this.pLevels[i2] = tmp;
    }
    InsertLevel(idx, lvl) { this.pLevels.splice(idx, 0, lvl); }
    Clear() { this.pLevels = []; }
}

class BinaryReader {
    constructor(buf) { this.dv = new DataView(buf); this.pos = 0; }
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
    skip(n) { this.pos += n; }
}

class BinaryWriter {
    constructor(size) {
        this.buf = new ArrayBuffer(size);
        this.dv = new DataView(this.buf);
        this.pos = 0; this.maxPos = 0;
    }
    writeByte(v) { this.dv.setInt8(this.pos, v); this.pos++; this.upd(); }
    writeShort(v) { this.dv.setInt16(this.pos, v, false); this.pos += 2; this.upd(); }
    writeInt(v) { this.dv.setInt32(this.pos, v, false); this.pos += 4; this.upd(); }
    writeString(s) {
        for (let i = 0; i < s.length; i++) { this.dv.setUint8(this.pos++, s.charCodeAt(i)); }
        this.dv.setUint8(this.pos++, 0); this.upd();
    }
    upd() { if (this.pos > this.maxPos) this.maxPos = this.pos; }
    getArray() { return new Uint8Array(this.buf, 0, this.maxPos); }
}

class Levels {
    constructor() { this.leagues = [new League(), new League(), new League()]; }
    Load(bytes) {
        try {
            let br = new BinaryReader(bytes);
            let offsets = [[], [], []];
            for (let i = 0; i < 3; i++) {
                let count = br.readInt();
                this.leagues[i] = new League();
                for (let j = 0; j < count; j++) {
                    offsets[i].push(br.readInt());
                    let lvl = new Level();
                    lvl.Name = br.readString();
                    this.leagues[i].AddLevel(lvl);
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < this.leagues[i].Count(); j++) {
                    br.pos = offsets[i][j];
                    let lvl = this.leagues[i].GetLevel(j);
                    br.readByte(); // 51
                    lvl.x0 = (br.readInt() >> 16) << 3;
                    lvl.y0 = (br.readInt() >> 16) << 3;
                    lvl.xEnd = (br.readInt() >> 16) << 3;
                    lvl.yEnd = (br.readInt() >> 16) << 3;
                    let pCount = br.readShort();
                    let px = br.readInt(), py = br.readInt();
                    lvl.AddPoint(new Point2(px, py));

                    for (let k = 1; k < pCount; k++) {
                        let dx = br.readByte();
                        if (dx === -1) { px += br.readInt(); py += br.readInt(); }
                        else { px += dx; py += br.readByte(); }
                        lvl.AddPoint(new Point2(px, py));
                    }
                }
            }
            return true;
        } catch (e) { console.error(e); return false; }
    }
    Save() {
        let bw = new BinaryWriter(1024 * 1024);
        let offsetsPos = [[], [], []];
        let actualOffsets = [[], [], []];
        
        for (let i = 0; i < 3; i++) {
            bw.writeInt(this.leagues[i].Count());
            for (let j = 0; j < this.leagues[i].Count(); j++) {
                offsetsPos[i].push(bw.pos);
                bw.writeInt(0);
                bw.writeString(this.leagues[i].GetLevel(j).Name);
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < this.leagues[i].Count(); j++) {
                let lvl = this.leagues[i].GetLevel(j);
                actualOffsets[i].push(bw.pos);
                bw.writeByte(51);
                bw.writeInt((lvl.x0 << 16) >> 3); bw.writeInt((lvl.y0 << 16) >> 3);
                bw.writeInt((lvl.xEnd << 16) >> 3); bw.writeInt((lvl.yEnd << 16) >> 3);
                bw.writeShort(lvl.Count());
                let p0 = lvl.GetPoint(0);
                bw.writeInt(p0 ? p0.x : 0); bw.writeInt(p0 ? p0.y : 0);
                for (let k = 1; k < lvl.Count(); k++) {
                    let p = lvl.GetPoint(k), prev = lvl.GetPoint(k - 1);
                    bw.writeByte(p.x - prev.x); bw.writeByte(p.y - prev.y);
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < offsetsPos[i].length; j++) {
                bw.pos = offsetsPos[i][j]; bw.writeInt(actualOffsets[i][j]);
            }
        }
        return bw.getArray();
    }
}

// --- J2ME LCDUI EMULATOR ---
class Command {
    constructor(label, type, priority) { this.label = label; this.type = type; this.priority = priority; }
}
Command.SCREEN = 1; Command.BACK = 2; Command.OK = 4;

class Displayable {
    constructor(title) {
        this.title = title; this.commands = []; this.listener = null;
    }
    addCommand(cmd) { this.commands.push(cmd); }
    setCommandListener(l) { this.listener = l; }
}

class List extends Displayable {
    constructor(title, type, elements = []) {
        super(title);
        this.items = elements; this.selectedIndex = 0;
    }
    append(str) { this.items.push(str); }
    deleteAll() { this.items = []; this.selectedIndex = 0; }
    size() { return this.items.length; }
    getSelectedIndex() { return this.selectedIndex; }
    setSelectedIndex(idx, _ignored) { this.selectedIndex = idx; this.renderUI(); }
    
    renderUI() {
        let html = "";
        for (let i = 0; i < this.items.length; i++) {
            html += `<div class="list-item ${i === this.selectedIndex ? 'selected' : ''}">${this.items[i]}</div>`;
        }
        document.getElementById("lcdui-content").innerHTML = html;
    }
    handleKey(k) {
        if (k === "ArrowDown" && this.selectedIndex < this.items.length - 1) { this.selectedIndex++; this.renderUI(); }
        if (k === "ArrowUp" && this.selectedIndex > 0) { this.selectedIndex--; this.renderUI(); }
    }
}
List.IMPLICIT = 3;
List.SELECT_COMMAND = new Command("Select", Command.SCREEN, 0);

class Form extends Displayable {
    constructor(title) { super(title); this.items = []; }
    append(item) { this.items.push(item); }
    renderUI() {
        let html = "";
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.type === "TextField") {
                html += `<span class="form-label">${it.label}</span><input type="text" id="form-item-${i}" value="${it.value}">`;
            } else if (it.type === "ChoiceGroup") {
                html += `<span class="form-label">${it.label}</span><div class="choice-group">`;
                for (let j = 0; j < it.choices.length; j++) {
                    let type = it.cgType === 2 ? "checkbox" : "radio";
                    let checked = it.flags[j] ? "checked" : "";
                    html += `<div class="choice-item"><input type="${type}" name="cg-${i}" id="cg-${i}-${j}" ${checked}><label>${it.choices[j]}</label></div>`;
                }
                html += `</div>`;
            }
        }
        document.getElementById("lcdui-content").innerHTML = html;
    }
    sync() {
        for (let i = 0; i < this.items.length; i++) {
            let it = this.items[i];
            if (it.type === "TextField") {
                let domItem = document.getElementById(`form-item-${i}`);
                if (domItem) it.value = domItem.value;
            }
            else if (it.type === "ChoiceGroup") {
                for (let j = 0; j < it.choices.length; j++) {
                    let domItem = document.getElementById(`cg-${i}-${j}`);
                    if (domItem) it.flags[j] = domItem.checked;
                }
            }
        }
    }
}

class TextField {
    constructor(label, text, maxSize, constraints) {
        this.type = "TextField"; this.label = label; this.value = text;
    }
    getString() { return this.value; }
    setString(s) { this.value = s; }
}

class ChoiceGroup {
    constructor(label, cgType) {
        this.type = "ChoiceGroup"; this.label = label; this.cgType = cgType; // 2=MULTIPLE, 4=EXCLUSIVE
        this.choices = []; this.flags = [];
    }
    append(str) { this.choices.push(str); this.flags.push(false); }
    getSelectedFlags(arr) { for(let i=0; i<this.choices.length; i++) arr[i] = this.flags[i]; }
}

class Display {
    constructor(main) {
        this.main = main; this.current = null;
        this.domCanvas = document.getElementById("game");
        this.domLcdui = document.getElementById("lcdui");
        this.domTitle = document.getElementById("lcdui-title");
        this.domMenu = document.getElementById("cmd-menu");
        this.cmdList = []; this.cmdSelected = 0; this.menuOpen = false;
        
        // Input Binding
        document.addEventListener("keydown", (e) => this.handleKey(e, true));
        document.addEventListener("keyup", (e) => this.handleKey(e, false));
    }
    setCurrent(disp) {
        if (this.current instanceof Form) this.current.sync();
        this.current = disp;
        this.menuOpen = false; this.domMenu.style.display = "none";

        if (disp === this.main.mCanvas) {
            this.domLcdui.style.display = "none";
            this.domCanvas.style.display = "block";
            document.getElementById("canvas-softkeys").style.display = "flex";
            document.getElementById("c-sk-left").innerText = "Menu";
        } else {
            this.domCanvas.style.display = "none";
            document.getElementById("canvas-softkeys").style.display = "none";
            this.domLcdui.style.display = "flex";
            this.domTitle.innerText = disp.title;
            if (disp.renderUI) disp.renderUI();
            
            // Layout Softkeys for UI
            let lCmd = null, rCmd = null;
            for (let c of disp.commands) {
                if (c.type === Command.BACK) rCmd = c;
                else if (!lCmd) lCmd = c;
            }
            if (disp instanceof List) lCmd = List.SELECT_COMMAND; // Implicit
            
            document.getElementById("sk-left").innerText = lCmd ? lCmd.label : "";
            document.getElementById("sk-right").innerText = rCmd ? rCmd.label : "";
            disp.lCmd = lCmd; disp.rCmd = rCmd;
        }
    }

    handleKey(e, isDown) {
        // Missing null check fix:
        if (!this.current) return;

        if (this.current === this.main.mCanvas && !this.menuOpen) {
            let keyMapped = -1;
            if (e.key === "ArrowUp") keyMapped = 1;
            if (e.key === "ArrowLeft") keyMapped = 2;
            if (e.key === "ArrowRight") keyMapped = 5;
            if (e.key === "ArrowDown") keyMapped = 6;
            if (e.key === "1") keyMapped = 49;
            if (e.key === "7") keyMapped = 55;
            if (e.key === "*" || e.key === "Delete") keyMapped = 42;
            if (e.key === "#" || e.code === "Space") keyMapped = 35;
            
            if (isDown && keyMapped !== -1) this.current.keyPressed(keyMapped);
            if (!isDown && keyMapped !== -1) this.current.keyReleased(keyMapped);

            // Handle Canvas Menu (Left Softkey / Enter)
            if (isDown && (e.key === "Enter" || e.code === "Space")) { // Open Menu
                if (keyMapped !== 35) this.openCanvasMenu();
            }
        } else if (isDown) {
            // UI Handling
            if (this.menuOpen) {
                if (e.key === "ArrowDown" && this.cmdSelected < this.cmdList.length - 1) { this.cmdSelected++; this.renderCanvasMenu(); }
                if (e.key === "ArrowUp" && this.cmdSelected > 0) { this.cmdSelected--; this.renderCanvasMenu(); }
                if (e.key === "Enter") {
                    let cmd = this.cmdList[this.cmdSelected];
                    this.menuOpen = false; this.domMenu.style.display = "none";
                    if(this.current.listener) this.current.listener.commandAction(cmd, this.current);
                }
                if (e.key === "Escape") { this.menuOpen = false; this.domMenu.style.display = "none"; }
            } else if (this.current !== this.main.mCanvas) {
                if (this.current instanceof Form) this.current.sync();
                if (this.current.handleKey) this.current.handleKey(e.key);
                
                if (e.key === "Enter" && this.current.lCmd && this.current.listener) {
                    this.current.listener.commandAction(this.current.lCmd, this.current);
                }
                if (e.key === "Escape" && this.current.rCmd && this.current.listener) {
                    this.current.listener.commandAction(this.current.rCmd, this.current);
                }
            }
        }
    }

    openCanvasMenu() {
        this.cmdList = this.current.commands;
        this.cmdSelected = 0;
        this.menuOpen = true;
        this.domMenu.style.display = "block";
        this.renderCanvasMenu();
    }
    renderCanvasMenu() {
        let h = "";
        for (let i = 0; i < this.cmdList.length; i++) {
            h += `<div class="cmd-item ${i === this.cmdSelected ? 'selected' : ''}">${this.cmdList[i].label}</div>`;
        }
        document.getElementById("cmd-list").innerHTML = h;
    }
}

// --- ACTUAL APP PORT ---
class CustomFont {
    constructor() { this.height = 12; }
    drawString(ctx, str, x, y) {
        ctx.font = "12px sans-serif"; ctx.fillStyle = "#000037"; ctx.fillText(str, x, y + 10);
    }
}

class MyCanvas extends Displayable {
    constructor(main) {
        super("Gravity Edit"); // Extend fix
        this.mMain = main;
        this.ctx = document.getElementById("game").getContext("2d");
        this.keys = new Array(16).fill(false);
        this.font = new CustomFont();

        this.iCurVertex = -1;
        this.sStatus = "Ready"; this.iStatusTimeout = 2000;
        this.nSpeed = 100;
        this.curLevel = 0; this.curTrack = 0;
        
        this.bDrawVertexCoords = false;
        this.nFileAccess = 2; // Default to Jsr-75 logic

        // LCDUI Components
        this.cmdOptions = new Command("Options", 1, 1);
        this.cmdManage = new Command("Manage Levels", 1, 1);
        this.cmdExit = new Command("Exit", 1, 1);
        this.cmdSave = new Command("Save", 1, 1);
        this.cmdLoad = new Command("Load", 1, 1);
        this.cmdOk = new Command("OK", 4, 1);
        this.cmdBack = new Command("Back", 2, 1);
        this.cmdCopy = new Command("Copy", 1, 1);
        this.cmdPaste = new Command("Paste", 1, 1);
        this.cmdMoveUp = new Command("Move up", 1, 1);
        this.cmdMoveDown = new Command("Move down", 1, 1);
        this.cmdCreateNew = new Command("Create new", 1, 1);
        this.cmdRemove = new Command("Remove", 1, 1);
        this.cmdLevelProp = new Command("Level properties", 1, 1);

        this.formOptions = new Form("Options");
        this.tfSpeed = new TextField("Cursor speed", "100", 3, 0);
        this.cgOptView = new ChoiceGroup("View", 2); this.cgOptView.append("Vertex coord.");
        this.tfRootJsr75 = new TextField("Jsr75 root", "c:\\", 8, 0);
        this.formOptions.append(this.tfSpeed); this.formOptions.append(this.cgOptView); this.formOptions.append(this.tfRootJsr75);
        this.formOptions.addCommand(this.cmdOk); this.formOptions.setCommandListener(this);

        this.formSave = new Form("Save");
        this.cgFileModeSave = new ChoiceGroup("File mode", 4); 
        ["Rms", "Siemens", "Jsr-75", "Symbian"].forEach(o => this.cgFileModeSave.append(o));
        this.cgFileModeSave.flags[2] = true; // Select Jsr-75 default
        this.tfFileNameSave = new TextField("File", "levels.mrg", 32, 0);
        this.formSave.append(this.cgFileModeSave); this.formSave.append(this.tfFileNameSave);
        this.formSave.addCommand(this.cmdOk); this.formSave.addCommand(this.cmdBack); this.formSave.setCommandListener(this);

        this.formLoad = new Form("Load");
        this.cgFileModeLoad = new ChoiceGroup("File mode", 4);
        ["Rms", "Siemens", "Jsr-75", "Symbian"].forEach(o => this.cgFileModeLoad.append(o));
        this.cgFileModeLoad.flags[2] = true;
        this.tfFileNameLoad = new TextField("File", "levels.mrg", 32, 0);
        this.formLoad.append(this.cgFileModeLoad); this.formLoad.append(this.tfFileNameLoad);
        this.formLoad.addCommand(this.cmdOk); this.formLoad.addCommand(this.cmdBack); this.formLoad.setCommandListener(this);

        this.lsLevel = new List("Level", 3, ["Easy", "Medium", "Pro"]);
        this.lsLevel.addCommand(this.cmdBack); this.lsLevel.setCommandListener(this);

        this.lsEasy = new List("Easy", 3); this.buildListCommands(this.lsEasy);
        this.lsMedium = new List("Medium", 3); this.buildListCommands(this.lsMedium);
        this.lsPro = new List("Pro", 3); this.buildListCommands(this.lsPro);
        this.UpdateList();

        this.formLevelProp = new Form("Level properties");
        this.propName = new TextField("Name", "", 12, 0);
        this.formLevelProp.append(this.propName);
        this.formLevelProp.addCommand(this.cmdOk); this.formLevelProp.addCommand(this.cmdBack);
        this.formLevelProp.setCommandListener(this);

        this.addCommand(this.cmdLevelProp);
        this.addCommand(this.cmdManage);
        this.addCommand(this.cmdSave);
        this.addCommand(this.cmdLoad);
        this.addCommand(this.cmdOptions);
        this.addCommand(this.cmdExit);
        this.setCommandListener(this);

        this.iCopyLeague = -1; this.iCopyTrack = -1;
        this.camX = 0; this.camY = 0;
        this.lastTime = performance.now();
        this.bCanLeft = true; this.bCanRight = true; this.bCanUp = true; this.bCanDown = true;
        
        requestAnimationFrame((ts) => this.paintLoop(ts));
    }

    buildListCommands(ls) {
        ls.addCommand(this.cmdBack); ls.addCommand(this.cmdMoveUp); ls.addCommand(this.cmdMoveDown);
        ls.addCommand(this.cmdCopy); ls.addCommand(this.cmdPaste); ls.addCommand(this.cmdCreateNew);
        ls.addCommand(this.cmdRemove); ls.setCommandListener(this);
    }

    UpdateList() {
        this.lsEasy.deleteAll(); this.lsMedium.deleteAll(); this.lsPro.deleteAll();
        let lg = this.mMain.levels.leagues;
        for (let i=0; i<lg[0].Count(); i++) this.lsEasy.append(lg[0].GetLevel(i).Name);
        for (let i=0; i<lg[1].Count(); i++) this.lsMedium.append(lg[1].GetLevel(i).Name);
        for (let i=0; i<lg[2].Count(); i++) this.lsPro.append(lg[2].GetLevel(i).Name);
        
        if (this.curLevel===0 && this.curTrack>lg[0].Count()-1) this.curTrack = Math.max(0, lg[0].Count()-1);
        if (this.curLevel===1 && this.curTrack>lg[1].Count()-1) this.curTrack = Math.max(0, lg[1].Count()-1);
        if (this.curLevel===2 && this.curTrack>lg[2].Count()-1) this.curTrack = Math.max(0, lg[2].Count()-1);
    }

    SetStatus(msg, to) { this.sStatus = msg; this.iStatusTimeout = to; }

    getGameAction(k) {
        if (k===1) return 1; if (k===2) return 2; if (k===5) return 5; if (k===6) return 6; return 0;
    }

    keyPressed(var1) {
        switch(this.getGameAction(var1)) {
            case 1: this.keys[2] = true; break; // UP
            case 2: this.keys[0] = true; break; // LEFT
            case 5: this.keys[1] = true; break; // RIGHT
            case 6: this.keys[3] = true; break; // DOWN
        }
        switch(var1) {
            case 35: // '#'
                let p = new Point2();
                let lvl = this.mMain.levels.leagues[this.curLevel].GetLevel(this.curTrack);
                if (!lvl) break;
                let idx = 0;
                for (let i=0; i<lvl.Count(); i++) if (lvl.GetPoint(i).x < this.camX) idx = i;
                p.x = this.camX; p.y = this.camY - 110;
                lvl.InsertPoint(idx+1, p);
                this.SetStatus(`add (${p.x},${p.y})`, 1000);
                break;
            case 42: // '*'
                let lv = this.mMain.levels.leagues[this.curLevel].GetLevel(this.curTrack);
                if (!lv) break;
                if (this.iCurVertex > 0 && this.iCurVertex < lv.Count() - 1) {
                    lv.RemovePoint(this.iCurVertex);
                    this.SetStatus(`del [${this.iCurVertex}]`, 1000);
                    this.iCurVertex = -1;
                } else if (this.iCurVertex === 0) this.SetStatus("Can't delete 1st point", 1000);
                else if (this.iCurVertex === lv.Count() - 1) this.SetStatus("Can't delete last point", 1000);
                break;
            case 49: this.keys[4] = true; break;
            case 55: this.keys[10] = true; break;
        }
    }

    keyReleased(var1) {
        switch(this.getGameAction(var1)) {
            case 1: this.keys[2] = false; break;
            case 2: this.keys[0] = false; break;
            case 5: this.keys[1] = false; break;
            case 6: this.keys[3] = false; break;
        }
        switch(var1) {
            case 49: this.keys[4] = false; break;
            case 55: 
                this.bCanLeft=true; this.bCanRight=true; this.bCanUp=true; this.bCanDown=true;
                this.keys[10] = false; break;
        }
    }

    commandAction(cmd, disp) {
        if (cmd === this.cmdManage) this.mMain.display.setCurrent(this.lsLevel);
        else if (cmd === List.SELECT_COMMAND) {
            if (disp === this.lsLevel) {
                let s = this.lsLevel.getSelectedIndex();
                if (s===0) this.mMain.display.setCurrent(this.lsEasy);
                else if (s===1) this.mMain.display.setCurrent(this.lsMedium);
                else if (s===2) this.mMain.display.setCurrent(this.lsPro);
            } else if (disp === this.lsEasy || disp === this.lsMedium || disp === this.lsPro) {
                let s = disp.getSelectedIndex();
                if (s >= 0) {
                    if (disp === this.lsEasy) { this.curLevel=0; this.curTrack=s; }
                    if (disp === this.lsMedium) { this.curLevel=1; this.curTrack=s; }
                    if (disp === this.lsPro) { this.curLevel=2; this.curTrack=s; }
                    this.camX = 0; this.camY = 0;
                }
                this.mMain.display.setCurrent(this);
            }
        } else if (cmd === this.cmdCopy) {
            this.iCopyTrack = disp.getSelectedIndex();
            if (disp === this.lsEasy) this.iCopyLeague = 0;
            if (disp === this.lsMedium) this.iCopyLeague = 1;
            if (disp === this.lsPro) this.iCopyLeague = 2;
        } else if (cmd === this.cmdPaste) {
            let s = disp.getSelectedIndex() + 1;
            let src = this.mMain.levels.leagues[this.iCopyLeague].GetLevel(this.iCopyTrack);
            let nLvl = new Level(src);
            if (disp === this.lsEasy) this.mMain.levels.leagues[0].InsertLevel(s, nLvl);
            if (disp === this.lsMedium) this.mMain.levels.leagues[1].InsertLevel(s, nLvl);
            if (disp === this.lsPro) this.mMain.levels.leagues[2].InsertLevel(s, nLvl);
            this.UpdateList();
        } else if (cmd === this.cmdMoveUp || cmd === this.cmdMoveDown) {
            let s = disp.getSelectedIndex(), lg = null;
            if (disp === this.lsEasy) lg = this.mMain.levels.leagues[0];
            if (disp === this.lsMedium) lg = this.mMain.levels.leagues[1];
            if (disp === this.lsPro) lg = this.mMain.levels.leagues[2];
            
            if (cmd === this.cmdMoveUp && s > 0) { lg.Swap(s, s-1); this.UpdateList(); disp.setSelectedIndex(s-1); this.curTrack--; }
            if (cmd === this.cmdMoveDown && s < disp.size()-1) { lg.Swap(s, s+1); this.UpdateList(); disp.setSelectedIndex(s+1); this.curTrack++; }
        } else if (cmd === this.cmdBack && disp === this.lsLevel) {
            this.mMain.display.setCurrent(this);
        } else if (cmd === this.cmdBack && (disp===this.lsEasy || disp===this.lsMedium || disp===this.lsPro)) {
            this.mMain.display.setCurrent(this.lsLevel);
        } else if (cmd === this.cmdBack && disp === this.formLevelProp) {
            this.mMain.display.setCurrent(this);
        } else if (cmd === this.cmdOptions) {
            this.mMain.display.setCurrent(this.formOptions);
        } else if (cmd === this.cmdLevelProp) {
            let lvl = this.mMain.levels.leagues[this.curLevel].GetLevel(this.curTrack);
            if(lvl) this.propName.setString(lvl.Name);
            this.mMain.display.setCurrent(this.formLevelProp);
        } else if (cmd === this.cmdExit) {
            alert("App Closed.");
        } else if (cmd === this.cmdOk && disp === this.formOptions) {
            let flags = []; this.cgOptView.getSelectedFlags(flags);
            this.bDrawVertexCoords = flags[0];
            this.nSpeed = parseInt(this.tfSpeed.getString(), 10) || 100;
            if (this.nSpeed < 10) this.nSpeed = 10; if (this.nSpeed > 200) this.nSpeed = 200;
            this.mMain.display.setCurrent(this);
        } else if (cmd === this.cmdOk && disp === this.formLevelProp) {
            this.mMain.levels.leagues[this.curLevel].GetLevel(this.curTrack).Name = this.propName.getString();
            this.UpdateList(); this.propName.setString("");
            this.mMain.display.setCurrent(this);
        } else if (cmd === this.cmdSave) {
            this.mMain.display.setCurrent(this.formSave);
        } else if (cmd === this.cmdLoad) {
            this.mMain.display.setCurrent(this.formLoad);
        } else if (cmd === this.cmdOk && disp === this.formSave) {
            let buf = this.mMain.levels.Save();
            let blob = new Blob([buf], {type: "application/octet-stream"});
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = this.tfFileNameSave.getString() || "levels.mrg";
            a.click();
            this.SetStatus("Saved", 1000);
            this.lastTime = performance.now();
            this.mMain.display.setCurrent(this);
        } else if (cmd === this.cmdOk && disp === this.formLoad) {
            let input = document.getElementById("fileLoad");
            input.onchange = (e) => {
                let file = e.target.files[0];
                if(file) {
                    let r = new FileReader();
                    r.onload = (evt) => {
                        this.mMain.levels.Load(evt.target.result);
                        this.UpdateList(); this.lastTime = performance.now();
                        this.SetStatus("Loaded", 1000);
                        this.mMain.display.setCurrent(this);
                    };
                    r.readAsArrayBuffer(file);
                }
            };
            input.click(); // Trigger native file picker
        } else if (cmd === this.cmdBack && (disp === this.formSave || disp === this.formLoad)) {
            this.mMain.display.setCurrent(this);
        } else if (cmd === this.cmdRemove) {
            let s = disp.getSelectedIndex();
            if (disp === this.lsEasy) this.mMain.levels.leagues[0].RemoveLevel(s);
            if (disp === this.lsMedium) this.mMain.levels.leagues[1].RemoveLevel(s);
            if (disp === this.lsPro) this.mMain.levels.leagues[2].RemoveLevel(s);
            this.UpdateList();
            if (disp.size() > 0) disp.setSelectedIndex(Math.min(s, disp.size()-1));
            this.SetStatus("Level removed", 1000);
        } else if (cmd === this.cmdCreateNew) {
            let s = disp.getSelectedIndex(), lg = null;
            if (disp === this.lsEasy) lg = this.mMain.levels.leagues[0];
            if (disp === this.lsMedium) lg = this.mMain.levels.leagues[1];
            if (disp === this.lsPro) lg = this.mMain.levels.leagues[2];
            
            let lv = new Level(); lv.Name = "New level";
            lv.x0 = -70; lv.y0 = -90; lv.xEnd = 70; lv.yEnd = -110;
            for(let vx = -100; vx < 100; vx+=30) lv.AddPoint(new Point2(vx, -110));
            lg.InsertLevel(Math.max(0, s), lv);
            this.UpdateList(); disp.setSelectedIndex(s);
            this.SetStatus("Level created", 1000);
        }
    }

    paintLoop(ts) {
        requestAnimationFrame((t) => this.paintLoop(t));
        if (this.mMain.display.current !== this) { this.lastTime = ts; return; } // Paused

        let dt = ts - this.lastTime; this.lastTime = ts;
        if (this.iStatusTimeout !== 0x7FFFFFFF) this.iStatusTimeout -= dt;
        if (this.iStatusTimeout <= 0) this.sStatus = "";

        let spd = Math.floor((dt * this.nSpeed) / 1000);
        if (spd > 2) spd = 2;

        let moving = false;
        if (this.keys[2] && this.bCanUp) { this.camY += spd; moving = true; }
        if (this.keys[3] && this.bCanDown) { this.camY -= spd; moving = true; }
        if (this.keys[0] && this.bCanLeft) { this.camX -= spd; moving = true; }
        if (this.keys[1] && this.bCanRight) { this.camX += spd; moving = true; }

        let cvs = this.ctx.canvas;
        let w = cvs.width = cvs.offsetWidth;
        let h = cvs.height = cvs.offsetHeight;
        let c = this.ctx;

        c.fillStyle = "rgb(255,255,255)"; c.fillRect(0,0,w,h);
        
        let lvl = this.mMain.levels.leagues[this.curLevel].GetLevel(this.curTrack);
        if (!lvl) {
            c.fillStyle = "rgb(210,210,255)"; c.fillRect(0,0,w, this.font.height+2);
            c.strokeStyle = "rgb(0,0,55)"; c.beginPath(); c.moveTo(0, this.font.height+2); c.lineTo(w, this.font.height+2); c.stroke();
            this.font.drawString(c, "No level", 1, 2);
            return;
        }

        let hy = this.camY + Math.floor(h/2);
        c.strokeStyle = "rgb(100,100,255)"; c.lineWidth = 1; c.beginPath();
        c.moveTo(0, hy); c.lineTo(w, hy);
        c.moveTo(Math.floor(w/2) - this.camX, hy - 8); c.lineTo(Math.floor(w/2) - this.camX, hy + 8); c.stroke();

        let dx = Math.abs(this.camX - lvl.x0);
        let dy = Math.abs(this.camY - lvl.y0 - 110);

        if (dx < 10 && dy < 10) {
            if (!moving) { this.camX = lvl.x0; this.camY = lvl.y0 + 110; }
            else if (this.keys[10]) {
                if (this.keys[2]) lvl.y0 += spd;
                if (this.keys[3]) lvl.y0 -= spd;
                if (this.keys[0]) lvl.x0 -= spd;
                if (this.keys[1]) lvl.x0 += spd;
            }
        }

        c.strokeStyle = "rgb(0,0,255)"; c.beginPath();
        c.moveTo(Math.floor(w/2) - this.camX + lvl.xEnd - 2, 0); c.lineTo(Math.floor(w/2) - this.camX + lvl.xEnd - 2, h);
        c.moveTo(Math.floor(w/2) - this.camX + lvl.xEnd + 2, 0); c.lineTo(Math.floor(w/2) - this.camX + lvl.xEnd + 2, h); c.stroke();

        dx = Math.abs(this.camX - lvl.xEnd);
        if (dx <= 2 && this.keys[10]) {
            if (this.keys[0]) lvl.xEnd -= spd;
            if (this.keys[1]) lvl.xEnd += spd;
        }

        let isSelected = false;
        for (let i=0; i<lvl.Count(); i++) {
            let pt = lvl.GetPoint(i);
            let next = (i < lvl.Count() - 1) ? lvl.GetPoint(i+1) : null;
            let prev = (i > 0) ? lvl.GetPoint(i-1) : null;

            let nx = 0, ny = 0;
            if (next) { nx = -this.camX + Math.floor(w/2) + next.x; ny = this.camY + Math.floor(h/2) - next.y - 110; }
            let px = -this.camX + Math.floor(w/2) + pt.x;
            let py = this.camY + Math.floor(h/2) - pt.y - 110;

            if ((px>=0 && px<=w && py>=0 && py<=h) || (next && (nx>=0||px>=0) && (nx<=w||px<=w))) {
                if (this.bDrawVertexCoords) this.font.drawString(c, `(${pt.x},${pt.y+113})`, px, py);
                
                let cx = Math.abs(this.camX - pt.x);
                let cy = Math.abs(this.camY - pt.y - 110);
                
                if (cx <= 2 && cy <= 2 && !isSelected) {
                    this.iCurVertex = i; isSelected = true;
                    if (!moving) { this.camX = pt.x; this.camY = pt.y + 110; }
                    else if (this.keys[10]) {
                        if (this.keys[2]) pt.y += spd;
                        if (this.keys[3]) pt.y -= spd;
                        if (this.keys[0]) pt.x -= spd;
                        if (this.keys[1]) pt.x += spd;

                        // Original logic limits delta to 127
                        if (i!==0 && prev) {
                            if (pt.x - prev.x > 127) { pt.x = prev.x + 127; this.bCanRight = false; } else this.bCanRight = true;
                            if (pt.x - prev.x <= 4) { this.bCanLeft = false; pt.x = prev.x + 4; } else this.bCanLeft = true;
                            if (pt.y - prev.y > 127) { pt.y = prev.y + 127; this.bCanUp = false; } else this.bCanUp = true;
                            if (pt.y - prev.y < -127) { pt.y = prev.y - 127; this.bCanDown = false; } else this.bCanDown = true;
                        }
                        if (i!==lvl.Count()-1 && next) {
                            if (pt.x - next.x < -127) { pt.x = next.x - 127; this.bCanLeft = false; } else this.bCanLeft = true;
                            if (next.x - pt.x <= 4) { pt.x = next.x - 4; this.bCanRight = false; } else this.bCanRight = true;
                            if (pt.y - next.y > 127) { pt.y = next.y + 127; this.bCanUp = false; } else this.bCanUp = true;
                            if (pt.y - next.y < -127) { pt.y = next.y - 127; this.bCanDown = false; } else this.bCanDown = true;
                        }
                        this.camX = pt.x; this.camY = pt.y + 110;
                    }
                }

                if (next) {
                    c.strokeStyle = (nx - px > 127) ? "rgb(255,0,0)" : "rgb(0,255,0)";
                    c.beginPath(); c.moveTo(px, py); c.lineTo(nx, ny); c.stroke();
                }
                c.fillStyle = "rgb(0,140,0)"; c.fillRect(px-2, py-2, 4, 4);
            }
        }

        c.strokeStyle = "rgb(0,0,0)"; c.beginPath();
        c.arc(-this.camX + Math.floor(w/2) + lvl.x0, -110 + this.camY + Math.floor(h/2) - lvl.y0, 10, 0, Math.PI*2); c.stroke();

        c.beginPath();
        c.moveTo(Math.floor(w/2), Math.floor(h/2)); c.lineTo(Math.floor(w/2)+8, Math.floor(h/2)+4);
        c.moveTo(Math.floor(w/2)+8, Math.floor(h/2)+4); c.lineTo(Math.floor(w/2)+4, Math.floor(h/2)+8);
        c.moveTo(Math.floor(w/2)+4, Math.floor(h/2)+8); c.lineTo(Math.floor(w/2), Math.floor(h/2)); c.stroke();
        
        this.font.drawString(c, `(${this.camX},${this.camY})`, Math.floor(w/2)+2, Math.floor(h/2)+10);

        c.fillStyle = "rgb(210,210,255)"; c.fillRect(0,0,w, this.font.height+2);
        c.strokeStyle = "rgb(0,0,55)"; c.beginPath(); c.moveTo(0, this.font.height+2); c.lineTo(w, this.font.height+2); c.stroke();
        this.font.drawString(c, lvl.Name, 1, 2);

        c.fillStyle = "rgb(210,210,255)"; c.fillRect(0, h-this.font.height-2, w, this.font.height+2);
        c.beginPath(); c.moveTo(0, h-this.font.height-2); c.lineTo(w, h-this.font.height-2); c.stroke();
        this.font.drawString(c, this.sStatus, 1, h-this.font.height);
    }
}

class Main {
    constructor() {
        this.display = new Display(this);
        this.levels = new Levels();
        
        // Add a default level so the app is immediately usable (equivalent to parsing a default jar mrg)
        let lv = new Level(); lv.Name = "Default Level";
        lv.x0 = -70; lv.y0 = -90; lv.xEnd = 70; lv.yEnd = -110;
        for(let vx = -100; vx < 100; vx+=30) lv.AddPoint(new Point2(vx, -110));
        this.levels.leagues[0].AddLevel(lv);

        this.mCanvas = new MyCanvas(this);
        this.display.setCurrent(this.mCanvas);
    }
}

// Start
window.onload = () => { window.app = new Main(); };