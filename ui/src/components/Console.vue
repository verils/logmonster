<template>
  <div class="ui inverted attached code segment console-container">
    <pre>
      <code v-for="(line,index) in lines" :key="index" v-html="line"></code>
    </pre>
  </div>
</template>

<script>
  export default {
    name: "Console",
    data: function () {
      return {
        initialized: false,
        lines: []
      }
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        const sse = new EventSource(`/api/targets/${this.$route.params.target}/console${location.search}`);
        sse.addEventListener('log', (e) => {
          let isAttached = this.isAttachedBottom();

          let text = this.highlight(e.data);
          this.lines.push(text)

          isAttached && this.attachBottom();
          this.lines.push(e.data)
        });
        sse.addEventListener('error', (e) => {
          if (e.data) {
            let text = `<span style="color: #db2828;">${e.data}</span>\n`;
            this.lines.push(text)
          }
          sse.close();
        });
      },
      isAttachedBottom: function () {
        let clientHeight = document.documentElement.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight;
        let scrollTop = document.documentElement.scrollTop;
        if (scrollHeight > clientHeight) {
          if (this.initialized) {
            let scrollBottom = scrollHeight - scrollTop - clientHeight;
            return Math.abs(scrollBottom) <= 1.2;
          } else {
            this.initialized = true;
            return true;
          }
        }
        return false;
      },
      attachBottom: function () {
        window.scrollTo(0, document.documentElement.scrollHeight);
      },
      highlight: function (text) {
        return text.replace(/(DEBUG)/ig, '<span style="color: #A333C8;">$1</span>')
          .replace(/(INFO)/ig, '<span style="color: #2185D0;">$1</span>')
          .replace(/(WARN|WARNING)/ig, '<span style="color: #F2711C;">$1</span>')
          .replace(/(ERROR)/ig, '<span style="color: #DB2828;">$1</span>');
      }
    }
  }
</script>

<style scoped>
  .console-container {
    min-height: 100%;
  }

  .console-container > pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .console-container > pre > code {
    font-size: 12px;
  }

  .console-container > pre > code > p {
    margin: 0;
  }
</style>
